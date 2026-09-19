import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  sellerId?: number;
  sellerBusinessName?: string;
  sellerStatus?: string;
  customerId?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization token missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'hercart_super_secret_jwt_key_2026_affordable_digital_commerce';
    const decoded = jwt.verify(token, secret) as { userId: number; role: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        seller: true,
        customer: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or account deactivated' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      sellerId: user.seller?.id,
      sellerBusinessName: user.seller?.businessName,
      sellerStatus: user.seller?.status,
      customerId: user.customer?.id,
    };

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
