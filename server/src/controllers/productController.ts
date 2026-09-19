import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { productCreateSchema, productUpdateSchema } from '../validators/schemas';
import { getSellerScopeFilter, verifyProductOwnership } from '../middleware/sellerIsolation';
import { logAudit } from '../utils/auditLogger';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 15));
  const skip = (page - 1) * limit;

  const search = (req.query.search as string)?.trim();
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const status = req.query.status as string;
  const stockStatus = req.query.stockStatus as string;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  // Apply seller isolation
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

  if (categoryId) where.categoryId = categoryId;
  if (status && status !== 'ALL') where.status = status;

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (stockStatus === 'low_stock') {
    where.inventory = {
      currentStock: { lte: 5, gt: 0 },
    };
  } else if (stockStatus === 'out_of_stock') {
    where.inventory = {
      currentStock: { lte: 0 },
    };
  } else if (stockStatus === 'in_stock') {
    where.inventory = {
      currentStock: { gt: 5 },
    };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, businessName: true, user: { select: { name: true, email: true } } } },
        images: { orderBy: { isPrimary: 'desc' } },
        inventory: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
      images: { orderBy: { isPrimary: 'desc' } },
      inventory: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      },
    },
  });

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  if (req.user?.role === 'SELLER' && product.sellerId !== req.user.sellerId) {
    res.status(403).json({ success: false, message: 'Forbidden: Access to another seller product denied' });
    return;
  }

  res.json({ success: true, data: product });
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const validated = productCreateSchema.parse(req.body);

  let sellerId = req.user?.sellerId;
  if (req.user?.role === 'SUPER_ADMIN' || req.user?.role === 'STAFF') {
    if (validated.sellerId) {
      sellerId = validated.sellerId;
    } else {
      const defaultSeller = await prisma.seller.findFirst();
      sellerId = defaultSeller?.id;
    }
  }

  if (!sellerId) {
    res.status(400).json({ success: false, message: 'Valid seller ID required to create product' });
    return;
  }

  // Check SKU uniqueness
  const existingSku = await prisma.product.findUnique({
    where: { sku: validated.sku },
  });
  if (existingSku) {
    res.status(400).json({ success: false, message: `Product with SKU '${validated.sku}' already exists` });
    return;
  }

  const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        sellerId,
        categoryId: validated.categoryId,
        name: validated.name,
        slug,
        sku: validated.sku,
        description: validated.description,
        price: validated.price,
        discountPrice: validated.discountPrice,
        taxRate: validated.taxRate,
        stockQuantity: validated.stockQuantity,
        lowStockThreshold: validated.lowStockThreshold,
        weightGrams: validated.weightGrams,
        dimensions: validated.dimensions,
        status: validated.status,
        images: {
          create: [{
            url: validated.imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
            isPrimary: true,
            sortOrder: 0,
          }],
        },
      },
    });

    const inventory = await tx.inventory.create({
      data: {
        productId: product.id,
        currentStock: validated.stockQuantity,
        reservedStock: 0,
        availableStock: validated.stockQuantity,
        lowStockThreshold: validated.lowStockThreshold,
        lastRestockedAt: new Date(),
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inventory.id,
        previousStock: 0,
        changeQuantity: validated.stockQuantity,
        newStock: validated.stockQuantity,
        reason: 'Initial stock on product creation',
        recordedByUserId: req.user?.id,
      },
    });

    return product;
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'CREATE_PRODUCT',
    entity: 'Product',
    entityId: String(result.id),
    details: { name: result.name, sku: result.sku, price: result.price, stock: validated.stockQuantity },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: result,
  });
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const validated = productUpdateSchema.parse(req.body);

  const isOwner = await verifyProductOwnership(id, { role: req.user!.role, sellerId: req.user?.sellerId });
  if (!isOwner) {
    res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify this product' });
    return;
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { inventory: true },
  });

  if (!existing) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  // If SKU updated, check uniqueness
  if (validated.sku && validated.sku !== existing.sku) {
    const skuCheck = await prisma.product.findUnique({ where: { sku: validated.sku } });
    if (skuCheck) {
      res.status(400).json({ success: false, message: `Product with SKU '${validated.sku}' already exists` });
      return;
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: validated.name,
        categoryId: validated.categoryId,
        sku: validated.sku,
        description: validated.description,
        price: validated.price,
        discountPrice: validated.discountPrice,
        taxRate: validated.taxRate,
        lowStockThreshold: validated.lowStockThreshold,
        weightGrams: validated.weightGrams,
        dimensions: validated.dimensions,
        status: validated.status,
      },
      include: {
        category: true,
        images: true,
        inventory: true,
      },
    });

    if (validated.imageUrl) {
      const primaryImg = await tx.productImage.findFirst({ where: { productId: id, isPrimary: true } });
      if (primaryImg) {
        await tx.productImage.update({ where: { id: primaryImg.id }, data: { url: validated.imageUrl } });
      } else {
        await tx.productImage.create({ data: { productId: id, url: validated.imageUrl, isPrimary: true } });
      }
    }

    return product;
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'UPDATE_PRODUCT',
    entity: 'Product',
    entityId: String(id),
    details: {
      oldPrice: existing.price,
      newPrice: updated.price,
      name: updated.name,
    },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updated,
  });
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const isOwner = await verifyProductOwnership(id, { role: req.user!.role, sellerId: req.user?.sellerId });
  if (!isOwner) {
    res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this product' });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  // Check if product has existing orders
  const orderCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    // Soft delete / archive if it has orders
    await prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
    res.json({
      success: true,
      message: 'Product archived because it has order records',
    });
  } else {
    // Hard delete
    await prisma.product.delete({ where: { id } });
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  }

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'DELETE_PRODUCT',
    entity: 'Product',
    entityId: String(id),
    details: { name: product.name, sku: product.sku },
    ipAddress: req.ip,
  });
};

export const duplicateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const isOwner = await verifyProductOwnership(id, { role: req.user!.role, sellerId: req.user?.sellerId });
  if (!isOwner) {
    res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
    return;
  }

  const orig = await prisma.product.findUnique({
    where: { id },
    include: { images: true, inventory: true },
  });

  if (!orig) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const newSku = `${orig.sku}-CPY${Math.floor(100 + Math.random() * 900)}`;
  const newName = `${orig.name} (Copy)`;

  const cloned = await prisma.$transaction(async (tx) => {
    const prod = await tx.product.create({
      data: {
        sellerId: orig.sellerId,
        categoryId: orig.categoryId,
        name: newName,
        slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: newSku,
        description: orig.description,
        price: orig.price,
        discountPrice: orig.discountPrice,
        taxRate: orig.taxRate,
        stockQuantity: orig.stockQuantity,
        lowStockThreshold: orig.lowStockThreshold,
        status: 'DRAFT',
        images: {
          create: orig.images.map((img) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        },
      },
    });

    const inv = await tx.inventory.create({
      data: {
        productId: prod.id,
        currentStock: orig.stockQuantity,
        availableStock: orig.stockQuantity,
        lowStockThreshold: orig.lowStockThreshold,
        lastRestockedAt: new Date(),
      },
    });

    await tx.inventoryTransaction.create({
      data: {
        inventoryId: inv.id,
        previousStock: 0,
        changeQuantity: orig.stockQuantity,
        newStock: orig.stockQuantity,
        reason: `Cloned from ${orig.sku}`,
        recordedByUserId: req.user?.id,
      },
    });

    return prod;
  });

  res.status(201).json({
    success: true,
    message: 'Product duplicated as draft',
    data: cloned,
  });
};
