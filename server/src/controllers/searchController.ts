import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getSellerScopeFilter } from '../middleware/sellerIsolation';

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  const query = (req.query.q as string)?.trim();
  if (!query || query.length < 2) {
    res.json({
      success: true,
      data: { products: [], orders: [], customers: [], sellers: [] },
    });
    return;
  }

  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const isSeller = req.user?.role === 'SELLER';

  const [products, orders, customers, sellers] = await Promise.all([
    // Products
    prisma.product.findMany({
      where: {
        ...sellerFilter,
        OR: [
          { name: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      select: { id: true, name: true, sku: true, price: true },
      take: 5,
    }),

    // Orders
    prisma.order.findMany({
      where: {
        ...sellerFilter,
        OR: [
          { orderNumber: { contains: query } },
        ],
      },
      select: { id: true, orderNumber: true, totalAmount: true, status: true },
      take: 5,
    }),

    // Customers
    prisma.customer.findMany({
      where: {
        ...(isSeller ? { orders: { some: { sellerId: req.user!.sellerId } } } : {}),
        OR: [
          { user: { name: { contains: query } } },
          { user: { email: { contains: query } } },
          { phone: { contains: query } },
        ],
      },
      select: {
        id: true,
        user: { select: { name: true, email: true } },
      },
      take: 5,
    }),

    // Sellers (Admins only)
    !isSeller
      ? prisma.seller.findMany({
          where: {
            OR: [
              { businessName: { contains: query } },
              { city: { contains: query } },
            ],
          },
          select: { id: true, businessName: true, status: true },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  res.json({
    success: true,
    data: {
      products,
      orders,
      customers: customers.map((c) => ({ id: c.id, name: c.user.name, email: c.user.email })),
      sellers,
    },
  });
};
