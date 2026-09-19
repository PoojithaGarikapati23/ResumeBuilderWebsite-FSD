import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { sellerStatusUpdateSchema } from '../validators/schemas';
import { logAudit } from '../utils/auditLogger';

export const getSellers = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
  const skip = (page - 1) * limit;

  const search = (req.query.search as string)?.trim();
  const status = req.query.status as string;
  const category = req.query.category as string;

  const where: any = {};

  if (status && status !== 'ALL') where.status = status;
  if (category && category !== 'ALL') where.businessCategory = category;

  if (search) {
    where.OR = [
      { businessName: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
      { city: { contains: search } },
    ];
  }

  const [total, sellers] = await Promise.all([
    prisma.seller.count({ where }),
    prisma.seller.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        _count: {
          select: {
            products: true,
            orders: true,
          },
        },
        commissions: {
          select: {
            grossSale: true,
            commissionAmount: true,
            sellerNetAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  // Aggregate metrics per seller
  const data = sellers.map((s) => {
    let totalRevenue = 0;
    let totalCommission = 0;
    let netPayout = 0;

    s.commissions.forEach((c) => {
      totalRevenue += c.grossSale;
      totalCommission += c.commissionAmount;
      netPayout += c.sellerNetAmount;
    });

    return {
      id: s.id,
      userId: s.userId,
      businessName: s.businessName,
      businessCategory: s.businessCategory,
      description: s.description,
      city: s.city,
      state: s.state,
      pincode: s.pincode,
      bankName: s.bankName,
      bankAccountNo: s.bankAccountNo ? `••••${s.bankAccountNo.slice(-4)}` : null,
      commissionRate: s.commissionRate || 2.0,
      status: s.status,
      rejectionReason: s.rejectionReason,
      createdAt: s.createdAt,
      user: s.user,
      productsCount: s._count.products,
      ordersCount: s._count.orders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
      netPayout: Math.round(netPayout * 100) / 100,
    };
  });

  res.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getSellerById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const seller = await prisma.seller.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      products: {
        take: 10,
        include: {
          category: { select: { name: true } },
          inventory: true,
          images: { where: { isPrimary: true }, take: 1 },
        },
      },
      orders: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { include: { user: { select: { name: true } } } },
        },
      },
      commissions: true,
    },
  });

  if (!seller) {
    res.status(404).json({ success: false, message: 'Seller not found' });
    return;
  }

  res.json({ success: true, data: seller });
};

export const updateSellerStatus = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const validated = sellerStatusUpdateSchema.parse(req.body);

  const seller = await prisma.seller.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!seller) {
    res.status(404).json({ success: false, message: 'Seller not found' });
    return;
  }

  const updated = await prisma.seller.update({
    where: { id },
    data: {
      status: validated.status,
      rejectionReason: validated.rejectionReason || null,
      commissionRate: validated.commissionRate !== undefined ? validated.commissionRate : seller.commissionRate,
    },
  });

  // Notify seller
  let notifMsg = `Your seller account has been ${validated.status.toLowerCase()}.`;
  if (validated.status === 'APPROVED') {
    notifMsg = 'Congratulations! Your seller account has been approved. You can now list and sell products on HerCart.';
  } else if (validated.status === 'REJECTED') {
    notifMsg = `Your seller application was not approved. Reason: ${validated.rejectionReason || 'Incomplete business information'}.`;
  }

  await prisma.notification.create({
    data: {
      userId: seller.userId,
      title: `Seller Status Update: ${validated.status}`,
      message: notifMsg,
      type: 'SELLER',
      link: '/dashboard',
    },
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: validated.status === 'APPROVED' ? 'APPROVE_SELLER' : (validated.status === 'SUSPENDED' ? 'SUSPEND_SELLER' : 'UPDATE_SELLER'),
    entity: 'Seller',
    entityId: String(seller.id),
    details: {
      sellerName: seller.businessName,
      previousStatus: seller.status,
      newStatus: validated.status,
      reason: validated.rejectionReason,
    },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: `Seller status updated to ${validated.status}`,
    data: updated,
  });
};
