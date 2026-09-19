import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getSellerScopeFilter } from '../middleware/sellerIsolation';

export const getReportData = async (req: Request, res: Response): Promise<void> => {
  const type = (req.query.type as string) || 'sales';
  const format = req.query.format as string; // 'json' or 'csv'

  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  let headers: string[] = [];
  let rows: any[] = [];
  let summary: Record<string, any> = {};

  if (type === 'sales' || type === 'orders') {
    const orders = await prisma.order.findMany({
      where: { ...sellerFilter },
      include: {
        customer: { include: { user: true } },
        seller: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalGross = 0;
    let totalTax = 0;
    let totalCommission = 0;
    let totalNet = 0;

    headers = ['Order ID', 'Date', 'Customer', 'Seller', 'Items Count', 'Subtotal (₹)', 'GST Tax (₹)', 'Commission (₹)', 'Net Payout (₹)', 'Status'];
    rows = orders.map((o) => {
      totalGross += o.subtotal;
      totalTax += o.tax;
      totalCommission += o.platformFee;
      totalNet += o.sellerPayout;

      return [
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString('en-IN'),
        o.customer.user.name,
        o.seller.businessName,
        o.items.length,
        o.subtotal.toFixed(2),
        o.tax.toFixed(2),
        o.platformFee.toFixed(2),
        o.sellerPayout.toFixed(2),
        o.status,
      ];
    });

    summary = {
      recordCount: orders.length,
      totalGross: Math.round(totalGross * 100) / 100,
      totalTax: Math.round(totalTax * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      totalNet: Math.round(totalNet * 100) / 100,
    };
  } else if (type === 'inventory' || type === 'products') {
    const products = await prisma.product.findMany({
      where: { ...sellerFilter },
      include: {
        category: true,
        seller: true,
        inventory: true,
      },
      orderBy: { name: 'asc' },
    });

    let totalStock = 0;
    let totalValuation = 0;

    headers = ['Product Name', 'SKU', 'Category', 'Seller', 'Price (₹)', 'Stock Quantity', 'Valuation (₹)', 'Status'];
    rows = products.map((p) => {
      const stock = p.inventory?.currentStock || 0;
      const price = p.discountPrice || p.price;
      const val = stock * price;
      totalStock += stock;
      totalValuation += val;

      return [
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        p.category.name,
        p.seller.businessName,
        price.toFixed(2),
        stock,
        val.toFixed(2),
        p.status,
      ];
    });

    summary = {
      recordCount: products.length,
      totalStock,
      totalValuation: Math.round(totalValuation * 100) / 100,
    };
  } else if (type === 'commission') {
    const commissions = await prisma.commission.findMany({
      where: {
        seller: { ...sellerFilter },
      },
      include: {
        seller: true,
        order: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalSales = 0;
    let totalPlatformFee = 0;
    let totalSellerEarned = 0;

    headers = ['Commission ID', 'Order ID', 'Seller', 'Gross Sale (₹)', 'Rate (%)', 'Commission Fee (₹)', 'Net Seller Payout (₹)', 'Status', 'Date'];
    rows = commissions.map((c) => {
      totalSales += c.grossSale;
      totalPlatformFee += c.commissionAmount;
      totalSellerEarned += c.sellerNetAmount;

      return [
        `COM-${c.id}`,
        c.order.orderNumber,
        c.seller.businessName,
        c.grossSale.toFixed(2),
        c.commissionRate.toFixed(1),
        c.commissionAmount.toFixed(2),
        c.sellerNetAmount.toFixed(2),
        c.status,
        new Date(c.createdAt).toLocaleDateString('en-IN'),
      ];
    });

    summary = {
      recordCount: commissions.length,
      totalSales: Math.round(totalSales * 100) / 100,
      totalPlatformFee: Math.round(totalPlatformFee * 100) / 100,
      totalSellerEarned: Math.round(totalSellerEarned * 100) / 100,
    };
  }

  if (format === 'csv') {
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="hercart-${type}-report.csv"`);
    res.send(csvContent);
    return;
  }

  res.json({
    success: true,
    reportType: type,
    headers,
    rows,
    summary,
  });
};
