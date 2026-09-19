import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { logAudit } from '../utils/auditLogger';

export const importProductsPreview = async (req: Request, res: Response): Promise<void> => {
  const { rows } = req.body; // Array of objects parsed from CSV

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({ success: false, message: 'No rows provided in import data' });
    return;
  }

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase().trim(), c.id]));

  const existingSkus = new Set(
    (await prisma.product.findMany({ select: { sku: true } })).map((p) => p.sku.toLowerCase().trim())
  );

  const seenSkusInBatch = new Set<string>();
  const validRows: any[] = [];
  const errorRows: any[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;
    const errors: string[] = [];

    const name = String(row['Product Name'] || row['name'] || '').trim();
    const sku = String(row['SKU'] || row['sku'] || '').trim();
    const categoryName = String(row['Category'] || row['category'] || '').trim();
    const priceStr = String(row['Price'] || row['price'] || '').replace(/[^0-9.]/g, '');
    const stockStr = String(row['Stock'] || row['stock'] || '0').replace(/[^0-9]/g, '');
    const description = String(row['Description'] || row['description'] || 'High quality handcrafted product').trim();
    const status = String(row['Status'] || row['status'] || 'ACTIVE').toUpperCase();

    if (!name) errors.push('Product Name is required');
    if (!sku) errors.push('SKU is required');
    
    if (sku) {
      const lowerSku = sku.toLowerCase();
      if (existingSkus.has(lowerSku)) {
        errors.push(`SKU '${sku}' already exists in database`);
      } else if (seenSkusInBatch.has(lowerSku)) {
        errors.push(`Duplicate SKU '${sku}' found within this import file`);
      } else {
        seenSkusInBatch.add(lowerSku);
      }
    }

    let categoryId = categoryMap.get(categoryName.toLowerCase());
    if (!categoryId) {
      // Default to first category if not matched
      categoryId = categories[0]?.id;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      errors.push('Price must be a positive number');
    }

    const stock = parseInt(stockStr, 10);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock quantity must be a non-negative integer');
    }

    if (errors.length > 0) {
      errorRows.push({
        rowNumber: rowNum,
        raw: row,
        errors,
      });
    } else {
      validRows.push({
        rowNumber: rowNum,
        name,
        sku,
        categoryId,
        categoryName: categoryName || categories[0]?.name,
        price,
        stock,
        description,
        status: ['ACTIVE', 'DRAFT', 'ARCHIVED'].includes(status) ? status : 'ACTIVE',
      });
    }
  }

  res.json({
    success: true,
    totalRows: rows.length,
    validCount: validRows.length,
    errorCount: errorRows.length,
    validRows,
    errorRows,
  });
};

export const importProductsCommit = async (req: Request, res: Response): Promise<void> => {
  const { validRows } = req.body;

  if (!validRows || !Array.isArray(validRows) || validRows.length === 0) {
    res.status(400).json({ success: false, message: 'No valid rows to commit' });
    return;
  }

  let sellerId = req.user?.sellerId;
  if (!sellerId) {
    const firstSeller = await prisma.seller.findFirst();
    sellerId = firstSeller?.id || 1;
  }

  let successCount = 0;

  for (const item of validRows) {
    try {
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const prod = await prisma.product.create({
        data: {
          sellerId: sellerId!,
          categoryId: item.categoryId,
          name: item.name,
          slug,
          sku: item.sku,
          description: item.description,
          price: item.price,
          taxRate: 5.0,
          stockQuantity: item.stock,
          lowStockThreshold: 5,
          status: item.status,
          images: {
            create: [{
              url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
              isPrimary: true,
            }],
          },
        },
      });

      const inv = await prisma.inventory.create({
        data: {
          productId: prod.id,
          currentStock: item.stock,
          availableStock: item.stock,
          lowStockThreshold: 5,
          lastRestockedAt: new Date(),
        },
      });

      await prisma.inventoryTransaction.create({
        data: {
          inventoryId: inv.id,
          previousStock: 0,
          changeQuantity: item.stock,
          newStock: item.stock,
          reason: 'Bulk CSV Import',
          recordedByUserId: req.user?.id,
        },
      });

      successCount++;
    } catch (err) {
      console.error(`Failed to import row for ${item.sku}:`, err);
    }
  }

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'BULK_IMPORT',
    entity: 'Product',
    details: { importedCount: successCount, totalAttempted: validRows.length },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: `Successfully imported ${successCount} products`,
    count: successCount,
  });
};

export const exportData = async (req: Request, res: Response): Promise<void> => {
  const entity = req.params.entity; // products, orders, inventory, customers

  let csvContent = '';

  if (entity === 'products') {
    const products = await prisma.product.findMany({
      include: { category: true, seller: true, inventory: true },
    });
    csvContent = ['ID,Product Name,SKU,Category,Seller,Price,Stock,Status,Created At']
      .concat(
        products.map((p) =>
          [
            p.id,
            `"${p.name.replace(/"/g, '""')}"`,
            p.sku,
            p.category.name,
            p.seller.businessName,
            p.price,
            p.inventory?.currentStock || 0,
            p.status,
            p.createdAt.toISOString(),
          ].join(',')
        )
      )
      .join('\n');
  } else if (entity === 'orders') {
    const orders = await prisma.order.findMany({
      include: { customer: { include: { user: true } }, seller: true },
    });
    csvContent = ['Order ID,Customer,Seller,Subtotal,Tax,Commission,Net Payout,Total,Status,Date']
      .concat(
        orders.map((o) =>
          [
            o.orderNumber,
            `"${o.customer.user.name.replace(/"/g, '""')}"`,
            `"${o.seller.businessName.replace(/"/g, '""')}"`,
            o.subtotal,
            o.tax,
            o.platformFee,
            o.sellerPayout,
            o.totalAmount,
            o.status,
            o.createdAt.toISOString(),
          ].join(',')
        )
      )
      .join('\n');
  } else if (entity === 'customers') {
    const customers = await prisma.customer.findMany({
      include: { user: true },
    });
    csvContent = ['ID,Name,Email,Phone,Total Orders,Total Spending,Joined At']
      .concat(
        customers.map((c) =>
          [
            c.id,
            `"${c.user.name.replace(/"/g, '""')}"`,
            c.user.email,
            c.phone || '',
            c.totalOrders,
            c.totalSpending,
            c.createdAt.toISOString(),
          ].join(',')
        )
      )
      .join('\n');
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="hercart-${entity}-export.csv"`);
  res.send(csvContent);
};
