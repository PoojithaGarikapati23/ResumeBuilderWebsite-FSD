import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: req.user.id, isRead: false },
  });

  res.json({
    success: true,
    unreadCount,
    data: notifications,
  });
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  await prisma.notification.updateMany({
    where: { id, userId: req.user!.id },
    data: { isRead: true },
  });

  res.json({ success: true, message: 'Notification marked as read' });
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id },
    data: { isRead: true },
  });

  res.json({ success: true, message: 'All notifications marked as read' });
};
