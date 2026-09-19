import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  res.json({
    success: true,
    data: categories.map((c) => ({
      ...c,
      productsCount: c._count.products,
    })),
  });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description, icon, commissionRate, taxRate } = req.body;
  if (!name) {
    res.status(400).json({ success: false, message: 'Category name is required' });
    return;
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      icon: icon || 'Sparkles',
      commissionRate: commissionRate ? Number(commissionRate) : null,
      taxRate: taxRate ? Number(taxRate) : 5.0,
    },
  });

  res.status(201).json({ success: true, data: category });
};
