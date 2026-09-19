import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const action = req.query.action as string;
  const entity = req.query.entity as string;
  const search = (req.query.search as string)?.trim();

  const where: any = {};
  if (action && action !== 'ALL') where.action = action;
  if (entity && entity !== 'ALL') where.entity = entity;
  if (search) {
    where.OR = [
      { userName: { contains: search } },
      { entityId: { contains: search } },
      { detailsJson: { contains: search } },
    ];
  }

  // If user is SELLER, only view their own actions
  if (req.user?.role === 'SELLER') {
    where.userId = req.user.id;
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
  ]);

  res.json({
    success: true,
    data: logs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
