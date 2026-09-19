export type Role = 'SUPER_ADMIN' | 'SELLER' | 'STAFF' | 'CUSTOMER';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  sellerId?: number;
  sellerBusinessName?: string;
  sellerStatus?: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  customerId?: number;
  permissions?: string[];
}

export interface Seller {
  id: number;
  userId: number;
  businessName: string;
  businessCategory: string;
  description?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  bankName?: string;
  bankAccountNo?: string;
  commissionRate: number;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  productsCount?: number;
  ordersCount?: number;
  totalRevenue?: number;
  totalCommission?: number;
  netPayout?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  commissionRate?: number | null;
  taxRate: number;
  isActive: boolean;
  productsCount?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Inventory {
  id: number;
  productId: number;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  lastRestockedAt?: string;
  product?: Product;
  transactions?: InventoryTransaction[];
}

export interface InventoryTransaction {
  id: number;
  inventoryId: number;
  previousStock: number;
  changeQuantity: number;
  newStock: number;
  reason: string;
  recordedByUserId?: number;
  createdAt: string;
}

export interface Product {
  id: number;
  sellerId: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  taxRate: number;
  stockQuantity: number;
  lowStockThreshold: number;
  weightGrams?: number;
  dimensions?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  featured?: boolean;
  createdAt: string;
  category?: Category;
  seller?: Seller;
  images?: ProductImage[];
  inventory?: Inventory;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
  product?: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  sellerId: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  platformFee: number;
  sellerPayout: number;
  totalAmount: number;
  shippingAddressJson: string;
  timelineJson: string;
  notes?: string;
  createdAt: string;
  customer?: {
    id: number;
    user: {
      name: string;
      email: string;
      phone?: string;
    };
    addresses?: any[];
  };
  seller?: {
    id: number;
    businessName: string;
    user?: { name: string; email: string };
  };
  items: OrderItem[];
  commission?: {
    id: number;
    grossSale: number;
    commissionRate: number;
    commissionAmount: number;
    sellerNetAmount: number;
    status: string;
  };
}

export interface Customer {
  id: number;
  userId: number;
  phone?: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderAt?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    createdAt?: string;
  };
  addresses?: Array<{
    id: number;
    name: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  }>;
  orders?: Order[];
}

export interface PlatformSettings {
  id: number;
  platformName: string;
  tagline: string;
  defaultCommissionRate: number;
  defaultGstRate: number;
  shippingFeeFlat: number;
  freeShippingThreshold: number;
  currencySymbol: string;
  supportEmail: string;
}

export interface AuditLog {
  id: number;
  userId?: number;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  detailsJson?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'ORDER' | 'INVENTORY' | 'SELLER' | 'PAYMENT' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
