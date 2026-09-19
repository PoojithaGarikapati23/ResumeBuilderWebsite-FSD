import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

/**
 * Returns seller filter object for Prisma queries:
 * If user is SELLER, always forces { sellerId: req.user.sellerId }.
 * If user is SUPER_ADMIN or STAFF, respects optional query sellerId or returns all.
 */
export const getSellerScopeFilter = (req: Request): { sellerId?: number } => {
  if (req.user?.role === 'SELLER') {
    if (!req.user.sellerId) {
      throw new Error('Seller profile not associated with user');
    }
    return { sellerId: req.user.sellerId };
  }

  // Super Admin / Staff can view a specific seller if passed in query
  if (req.query.sellerId) {
    return { sellerId: Number(req.query.sellerId) };
  }

  return {};
};

/**
 * Verifies that the given resource (product, order, etc.) belongs to the logged-in seller
 * if the user has role SELLER.
 */
export const verifyProductOwnership = async (productId: number, user: { role: string; sellerId?: number }): Promise<boolean> => {
  if (user.role === 'SUPER_ADMIN' || user.role === 'STAFF') {
    return true;
  }
  if (user.role === 'SELLER') {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true },
    });
    return product?.sellerId === user.sellerId;
  }
  return false;
};

export const verifyOrderOwnership = async (orderId: number, user: { role: string; sellerId?: number; customerId?: number }): Promise<boolean> => {
  if (user.role === 'SUPER_ADMIN' || user.role === 'STAFF') {
    return true;
  }
  if (user.role === 'SELLER') {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { sellerId: true },
    });
    return order?.sellerId === user.sellerId;
  }
  if (user.role === 'CUSTOMER') {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { customerId: true },
    });
    return order?.customerId === user.customerId;
  }
  return false;
};
