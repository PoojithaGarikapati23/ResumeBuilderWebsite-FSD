import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getSellerScopeFilter } from '../middleware/sellerIsolation';

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  // Scoped orders
  const orders = await prisma.order.findMany({
    where: {
      ...sellerFilter,
    },
    select: {
      id: true,
      totalAmount: true,
      subtotal: true,
      platformFee: true,
      sellerPayout: true,
      status: true,
      createdAt: true,
    },
  });

  const isSeller = req.user?.role === 'SELLER';

  let totalSales = 0;
  let platformCommission = 0;
  let pendingOrders = 0;

  orders.forEach((o) => {
    if (o.status !== 'CANCELLED') {
      totalSales += isSeller ? o.sellerPayout : o.totalAmount;
      platformCommission += o.platformFee;
    }
    if (o.status === 'PENDING' || o.status === 'CONFIRMED') {
      pendingOrders++;
    }
  });

  // Products
  const [totalProducts, lowStockProducts, activeSellers, totalCustomers] = await Promise.all([
    prisma.product.count({ where: { ...sellerFilter } }),
    prisma.inventory.count({
      where: {
        product: { ...sellerFilter },
        currentStock: { lte: 5 },
      },
    }),
    prisma.seller.count({ where: { status: 'APPROVED' } }),
    prisma.customer.count(),
  ]);

  res.json({
    success: true,
    data: {
      totalSales: Math.round(totalSales * 100) / 100,
      salesGrowth: '+12.4%',
      totalOrders: orders.length,
      ordersGrowth: '+8.1%',
      totalProducts,
      productsGrowth: '+15.2%',
      activeSellers: isSeller ? 1 : activeSellers,
      sellersGrowth: '+5.0%',
      totalCustomers,
      customersGrowth: '+18.6%',
      pendingOrders,
      lowStockProducts,
      platformCommission: Math.round(platformCommission * 100) / 100,
      commissionGrowth: '+11.8%',
      isSeller,
    },
  });
};

export const getRevenueTrend = async (req: Request, res: Response): Promise<void> => {
  const timeframe = (req.query.timeframe as string) || 'monthly'; // daily, weekly, monthly
  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const orders = await prisma.order.findMany({
    where: {
      ...sellerFilter,
      status: { not: 'CANCELLED' },
    },
    orderBy: { createdAt: 'asc' },
    select: {
      totalAmount: true,
      sellerPayout: true,
      platformFee: true,
      createdAt: true,
    },
  });

  const isSeller = req.user?.role === 'SELLER';
  const trendMap: Record<string, { label: string; revenue: number; commission: number; orders: number }> = {};

  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    let key = '';
    let label = '';

    if (timeframe === 'daily') {
      key = d.toISOString().split('T')[0];
      label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } else if (timeframe === 'weekly') {
      const weekNum = Math.ceil(d.getDate() / 7);
      key = `${d.getFullYear()}-W${weekNum}`;
      label = `W${weekNum} ${d.toLocaleDateString('en-IN', { month: 'short' })}`;
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    }

    if (!trendMap[key]) {
      trendMap[key] = { label, revenue: 0, commission: 0, orders: 0 };
    }

    trendMap[key].revenue += isSeller ? o.sellerPayout : o.totalAmount;
    trendMap[key].commission += o.platformFee;
    trendMap[key].orders += 1;
  });

  const data = Object.values(trendMap).map((item) => ({
    ...item,
    revenue: Math.round(item.revenue),
    commission: Math.round(item.commission),
  }));

  res.json({ success: true, data });
};

export const getCategorySales = async (req: Request, res: Response): Promise<void> => {
  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        ...sellerFilter,
        status: { not: 'CANCELLED' },
      },
    },
    include: {
      product: {
        include: { category: true },
      },
    },
  });

  const categoryMap: Record<string, number> = {};

  orderItems.forEach((item) => {
    const catName = item.product.category.name;
    categoryMap[catName] = (categoryMap[catName] || 0) + item.totalPrice;
  });

  const data = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  res.json({ success: true, data });
};

export const getTopProducts = async (req: Request, res: Response): Promise<void> => {
  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        ...sellerFilter,
        status: { not: 'CANCELLED' },
      },
    },
    include: {
      product: {
        select: { id: true, name: true, sku: true, price: true },
      },
    },
  });

  const productMap: Record<number, { name: string; sku: string; sales: number; revenue: number }> = {};

  orderItems.forEach((item) => {
    const p = item.product;
    if (!productMap[p.id]) {
      productMap[p.id] = { name: p.name, sku: p.sku, sales: 0, revenue: 0 };
    }
    productMap[p.id].sales += item.quantity;
    productMap[p.id].revenue += item.totalPrice;
  });

  const data = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  res.json({ success: true, data });
};

export const getSellerPerformance = async (req: Request, res: Response): Promise<void> => {
  const sellers = await prisma.seller.findMany({
    include: {
      user: { select: { name: true } },
      _count: { select: { products: true, orders: true } },
      commissions: {
        select: { grossSale: true, commissionAmount: true, sellerNetAmount: true },
      },
    },
    take: 10,
  });

  const data = sellers.map((s) => {
    let revenue = 0;
    let commission = 0;
    s.commissions.forEach((c) => {
      revenue += c.grossSale;
      commission += c.commissionAmount;
    });

    return {
      id: s.id,
      name: s.businessName,
      owner: s.user.name,
      category: s.businessCategory,
      products: s._count.products,
      orders: s._count.orders,
      revenue: Math.round(revenue),
      commission: Math.round(commission),
    };
  });

  res.json({ success: true, data });
};
