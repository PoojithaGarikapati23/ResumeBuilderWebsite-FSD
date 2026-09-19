import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SELLER', 'CUSTOMER']).default('SELLER'),
  phone: z.string().optional(),
  // If role is SELLER:
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  description: z.string().optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  categoryId: z.number().int().positive('Valid category required'),
  sellerId: z.number().int().positive().optional(), // Inferred from token for SELLER role
  sku: z.string().min(3, 'SKU is required').max(30),
  description: z.string().min(5, 'Description is required'),
  price: z.number().positive('Price must be greater than zero'),
  discountPrice: z.number().positive().optional().nullable(),
  taxRate: z.number().min(0).max(100).default(5.0),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(1).default(5),
  weightGrams: z.number().min(0).optional().default(250),
  dimensions: z.string().optional().default('25x20x5 cm'),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).default('ACTIVE'),
  imageUrl: z.string().url().optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const inventoryAdjustSchema = z.object({
  changeQuantity: z.number().int('Adjustment must be an integer'),
  reason: z.string().min(3, 'A valid reason for stock adjustment is required'),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export const sellerStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'SUSPENDED', 'REJECTED']),
  rejectionReason: z.string().optional(),
  commissionRate: z.number().min(0).max(50).optional(),
});

export const settingsUpdateSchema = z.object({
  platformName: z.string().min(2).optional(),
  tagline: z.string().optional(),
  defaultCommissionRate: z.number().min(0).max(20).optional(),
  defaultGstRate: z.number().min(0).max(50).optional(),
  shippingFeeFlat: z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
  supportEmail: z.string().email().optional(),
});
