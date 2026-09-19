import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { inventoryAdjustSchema } from '../validators/schemas';
import { getSellerScopeFilter } from '../middleware/sellerIsolation';
import { logAudit } from '../utils/auditLogger';

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim();
  const filterStatus = req.query.status as string; // all, in_stock, low_stock, out_of_stock

  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const productWhere: any = {
    ...sellerFilter,
  };

  if (search) {
    productWhere.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  // Calculate high-level KPIs across all scoped items
  const allScoped = await prisma.inventory.findMany({
    where: {
      product: productWhere,
    },
    include: {
      product: { select: { price: true, discountPrice: true } },
    },
  });

  const totalItems = allScoped.length;
  let totalStockCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalValuation = 0;

  allScoped.forEach((inv) => {
    totalStockCount += inv.currentStock;
    const price = inv.product.discountPrice || inv.product.price;
    totalValuation += inv.currentStock * price;

    if (inv.currentStock <= 0) {
      outOfStockCount++;
    } else if (inv.currentStock <= inv.lowStockThreshold) {
      lowStockCount++;
    }
  });

  // Apply status filter for paginated list
  const invWhere: any = {
    product: productWhere,
  };

  if (filterStatus === 'low_stock') {
    invWhere.currentStock = { lte: 5, gt: 0 };
  } else if (filterStatus === 'out_of_stock') {
    invWhere.currentStock = { lte: 0 };
  } else if (filterStatus === 'in_stock') {
    invWhere.currentStock = { gt: 5 };
  }

  const [count, items] = await Promise.all([
    prisma.inventory.count({ where: invWhere }),
    prisma.inventory.findMany({
      where: invWhere,
      include: {
        product: {
          include: {
            category: true,
            seller: { select: { businessName: true } },
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  res.json({
    success: true,
    kpis: {
      totalItems,
      totalStockCount,
      lowStockCount,
      outOfStockCount,
      totalValuation: Math.round(totalValuation * 100) / 100,
    },
    data: items,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
};

export const adjustStock = async (req: Request, res: Response): Promise<void> => {
  const inventoryId = Number(req.params.id);
  const validated = inventoryAdjustSchema.parse(req.body);

  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { product: true },
  });

  if (!inventory) {
    res.status(404).json({ success: false, message: 'Inventory record not found' });
    return;
  }

  // Seller isolation
  if (req.user?.role === 'SELLER' && inventory.product.sellerId !== req.user.sellerId) {
    res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    return;
  }

  const previousStock = inventory.currentStock;
  const newStock = previousStock + validated.changeQuantity;

  if (newStock < 0) {
    res.status(400).json({
      success: false,
      message: `Cannot reduce stock below 0. Current available stock is ${previousStock}.`,
    });
    return;
  }

  const updated = await prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.update({
      where: { id: inventoryId },
      data: {
        currentStock: newStock,
        availableStock: Math.max(0, newStock - inventory.reservedStock),
        lastRestockedAt: validated.changeQuantity > 0 ? new Date() : inventory.lastRestockedAt,
      },
      include: { product: true },
    });

    await tx.product.update({
      where: { id: inventory.productId },
      data: { stockQuantity: newStock },
    });

    const txn = await tx.inventoryTransaction.create({
      data: {
        inventoryId,
        previousStock,
        changeQuantity: validated.changeQuantity,
        newStock,
        reason: validated.reason,
        recordedByUserId: req.user?.id,
      },
    });

    return { inv, txn };
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'UPDATE_INVENTORY',
    entity: 'Inventory',
    entityId: inventory.product.sku,
    details: {
      product: inventory.product.name,
      previousStock,
      adjustment: validated.changeQuantity,
      newStock,
      reason: validated.reason,
    },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: 'Stock updated successfully',
    data: updated,
  });
};

export const getInventoryHistory = async (req: Request, res: Response): Promise<void> => {
  const inventoryId = Number(req.params.id);

  const transactions = await prisma.inventoryTransaction.findMany({
    where: { inventoryId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.json({ success: true, data: transactions });
};
