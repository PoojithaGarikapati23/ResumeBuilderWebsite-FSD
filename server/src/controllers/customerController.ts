import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string)?.trim();

  const where: any = {};

  if (search) {
    where.OR = [
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
      { phone: { contains: search } },
    ];
  }

  // If user is SELLER, filter to customers who have ordered from this seller
  if (req.user?.role === 'SELLER' && req.user.sellerId) {
    where.orders = {
      some: {
        sellerId: req.user.sellerId,
      },
    };
  }

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, phone: true, avatar: true } },
        addresses: { where: { isDefault: true }, take: 1 },
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true },
        },
      },
      orderBy: { totalSpending: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  res.json({
    success: true,
    data: customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true, avatar: true, createdAt: true } },
      addresses: true,
      orders: {
        include: {
          items: { include: { product: { select: { name: true, sku: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    res.status(404).json({ success: false, message: 'Customer not found' });
    return;
  }

  res.json({ success: true, data: customer });
};
