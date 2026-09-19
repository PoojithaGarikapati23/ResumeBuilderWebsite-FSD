import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { orderStatusUpdateSchema } from '../validators/schemas';
import { getSellerScopeFilter, verifyOrderOwnership } from '../middleware/sellerIsolation';
import { logAudit } from '../utils/auditLogger';

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
  const skip = (page - 1) * limit;

  const search = (req.query.search as string)?.trim();
  const status = req.query.status as string;
  const paymentStatus = req.query.paymentStatus as string;

  let sellerFilter = {};
  if (req.user) {
    try {
      sellerFilter = getSellerScopeFilter(req);
    } catch {
      sellerFilter = {};
    }
  }

  const where: any = {
    ...sellerFilter,
  };

  if (status && status !== 'ALL') where.status = status;
  if (paymentStatus && paymentStatus !== 'ALL') where.paymentStatus = paymentStatus;

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { customer: { user: { name: { contains: search } } } },
      { customer: { user: { email: { contains: search } } } },
    ];
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: {
        customer: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        seller: {
          select: { id: true, businessName: true },
        },
        items: {
          include: {
            product: { select: { name: true, sku: true } },
          },
        },
        payment: true,
        commission: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
          addresses: true,
        },
      },
      seller: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: { select: { name: true } },
            },
          },
        },
      },
      payment: true,
      commission: true,
    },
  });

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const isAllowed = await verifyOrderOwnership(id, {
    role: req.user!.role,
    sellerId: req.user?.sellerId,
    customerId: req.user?.customerId,
  });

  if (!isAllowed) {
    res.status(403).json({ success: false, message: 'Forbidden: Access denied to this order' });
    return;
  }

  res.json({ success: true, data: order });
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const validated = orderStatusUpdateSchema.parse(req.body);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, seller: true },
  });

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const isAllowed = await verifyOrderOwnership(id, {
    role: req.user!.role,
    sellerId: req.user?.sellerId,
  });

  if (!isAllowed) {
    res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    return;
  }

  // Parse timeline
  let timeline: any[] = [];
  try {
    timeline = JSON.parse(order.timelineJson);
    if (!Array.isArray(timeline)) timeline = [];
  } catch {
    timeline = [];
  }

  const note = validated.note || (validated.trackingNumber ? `Tracking: ${validated.trackingNumber}` : `Status updated to ${validated.status}`);
  timeline.push({
    status: validated.status,
    timestamp: new Date().toISOString(),
    note,
    updatedBy: req.user?.name || 'System',
  });

  const updatedOrder = await prisma.$transaction(async (tx) => {
    // If order is cancelled and wasn't previously cancelled, restore stock
    if (validated.status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: {
              currentStock: { increment: item.quantity },
              availableStock: { increment: item.quantity },
            },
          });
          await tx.inventoryTransaction.create({
            data: {
              inventoryId: inv.id,
              previousStock: inv.currentStock,
              changeQuantity: item.quantity,
              newStock: inv.currentStock + item.quantity,
              reason: `Order #${order.orderNumber} cancelled`,
              recordedByUserId: req.user?.id,
            },
          });
        }
      }
    }

    // If order is delivered, settle commission
    if (validated.status === 'DELIVERED') {
      await tx.commission.updateMany({
        where: { orderId: order.id },
        data: { status: 'SETTLED', settledAt: new Date() },
      });
    }

    return tx.order.update({
      where: { id },
      data: {
        status: validated.status,
        timelineJson: JSON.stringify(timeline),
      },
      include: {
        customer: { include: { user: true } },
        items: true,
        commission: true,
      },
    });
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'UPDATE_ORDER',
    entity: 'Order',
    entityId: order.orderNumber,
    details: {
      previousStatus: order.status,
      newStatus: validated.status,
      note,
    },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: `Order status updated to ${validated.status}`,
    data: updatedOrder,
  });
};

/**
 * Customer / Storefront checkout endpoint for creating realistic marketplace orders
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { items, shippingAddress, paymentMethod = 'UPI' } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'Cart items required' });
    return;
  }

  // Group items by seller or process single seller order
  const firstProd = await prisma.product.findUnique({
    where: { id: items[0].productId },
    include: { seller: true },
  });

  if (!firstProd) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const seller = firstProd.seller;
  let subtotal = 0;
  const orderItemsData: any[] = [];

  for (const it of items) {
    const p = await prisma.product.findUnique({
      where: { id: it.productId },
      include: { inventory: true },
    });
    if (!p) continue;

    const unitPrice = p.discountPrice || p.price;
    const qty = it.quantity || 1;
    subtotal += unitPrice * qty;

    orderItemsData.push({
      productId: p.id,
      quantity: qty,
      unitPrice,
      taxRate: p.taxRate,
      totalPrice: unitPrice * qty,
    });
  }

  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const shippingFee = subtotal > 999 ? 0 : 50;
  const commissionRate = seller.commissionRate || 2.0;
  const platformFee = Math.round(subtotal * (commissionRate / 100) * 100) / 100;
  const sellerPayout = Math.round((subtotal + tax - platformFee) * 100) / 100;
  const totalAmount = Math.round((subtotal + tax + shippingFee) * 100) / 100;

  // Find or create customer
  let customerId = req.user?.customerId;
  if (!customerId) {
    const existingCust = await prisma.customer.findFirst();
    customerId = existingCust?.id || 1;
  }

  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  const timeline = [
    { status: 'Order Placed', timestamp: new Date().toISOString(), note: 'Order placed online' },
  ];

  const newOrder = await prisma.$transaction(async (tx) => {
    const ord = await tx.order.create({
      data: {
        orderNumber,
        customerId,
        sellerId: seller.id,
        status: 'PENDING',
        paymentStatus: 'PAID',
        subtotal,
        discount: 0,
        tax,
        shippingFee,
        platformFee,
        sellerPayout,
        totalAmount,
        shippingAddressJson: JSON.stringify(shippingAddress || {
          name: req.user?.name || 'Customer',
          street: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
        }),
        timelineJson: JSON.stringify(timeline),
      },
    });

    for (const oi of orderItemsData) {
      await tx.orderItem.create({
        data: {
          orderId: ord.id,
          ...oi,
        },
      });

      // Reduce inventory
      const inv = await tx.inventory.findUnique({ where: { productId: oi.productId } });
      if (inv) {
        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            currentStock: Math.max(0, inv.currentStock - oi.quantity),
            availableStock: Math.max(0, inv.availableStock - oi.quantity),
          },
        });
        await tx.inventoryTransaction.create({
          data: {
            inventoryId: inv.id,
            previousStock: inv.currentStock,
            changeQuantity: -oi.quantity,
            newStock: Math.max(0, inv.currentStock - oi.quantity),
            reason: `Order #${orderNumber}`,
            recordedByUserId: req.user?.id,
          },
        });
      }
    }

    // Payment record
    await tx.payment.create({
      data: {
        orderId: ord.id,
        method: paymentMethod,
        transactionRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: totalAmount,
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Commission record
    await tx.commission.create({
      data: {
        orderId: ord.id,
        sellerId: seller.id,
        grossSale: subtotal,
        commissionRate,
        commissionAmount: platformFee,
        taxOnCommission: Math.round(platformFee * 0.18 * 100) / 100,
        sellerNetAmount: sellerPayout,
        status: 'PENDING',
      },
    });

    // Notify seller
    await tx.notification.create({
      data: {
        userId: seller.userId,
        title: `New Order #${orderNumber}`,
        message: `You have received a new order for ₹${totalAmount}`,
        type: 'ORDER',
        link: `/dashboard/orders`,
      },
    });

    return ord;
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: newOrder,
  });
};
