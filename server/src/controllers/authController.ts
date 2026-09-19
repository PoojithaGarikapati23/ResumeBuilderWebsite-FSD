import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { loginSchema, registerSchema } from '../validators/schemas';
import { logAudit } from '../utils/auditLogger';

const JWT_SECRET = process.env.JWT_SECRET || 'hercart_super_secret_jwt_key_2026_affordable_digital_commerce';

export const login = async (req: Request, res: Response): Promise<void> => {
  const validated = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validated.email.toLowerCase().trim() },
    include: {
      seller: true,
      customer: true,
    },
  });

  if (!user || !user.isActive) {
    res.status(401).json({ success: false, message: 'Invalid credentials or inactive account' });
    return;
  }

  const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  await logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'LOGIN',
    entity: 'Auth',
    entityId: String(user.id),
    details: { email: user.email, role: user.role },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      sellerId: user.seller?.id,
      sellerBusinessName: user.seller?.businessName,
      sellerStatus: user.seller?.status,
      customerId: user.customer?.id,
    },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const data = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (existing) {
    res.status(400).json({ success: false, message: 'Email address is already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        name: data.name,
        role: data.role,
        phone: data.phone,
        avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80`,
      },
    });

    let seller = null;
    let customer = null;

    if (data.role === 'SELLER') {
      seller = await tx.seller.create({
        data: {
          userId: user.id,
          businessName: data.businessName || `${data.name}'s Workshop`,
          businessCategory: data.businessCategory || "Women's Clothing",
          description: data.description || 'Affordable handcrafted products made with care.',
          phone: data.phone,
          city: data.city || 'Hyderabad',
          state: data.state || 'Telangana',
          pincode: data.pincode || '500001',
          status: 'PENDING', // Super Admin approves
          commissionRate: 2.0, // Default 2%
        },
      });

      // Send notification to Super Admin
      const admins = await tx.user.findMany({ where: { role: 'SUPER_ADMIN' } });
      for (const admin of admins) {
        await tx.notification.create({
          data: {
            userId: admin.id,
            title: 'New Seller Registration',
            message: `${seller.businessName} registered and is awaiting approval.`,
            type: 'SELLER',
            link: '/dashboard/sellers',
          },
        });
      }
    } else if (data.role === 'CUSTOMER') {
      customer = await tx.customer.create({
        data: {
          userId: user.id,
          phone: data.phone,
        },
      });
    }

    return { user, seller, customer };
  });

  const token = jwt.sign(
    { userId: result.user.id, role: result.user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  await logAudit({
    userId: result.user.id,
    userName: result.user.name,
    userRole: result.user.role,
    action: 'REGISTER',
    entity: 'User',
    entityId: String(result.user.id),
    details: { email: result.user.email, role: result.user.role },
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      avatar: result.user.avatar,
      sellerId: result.seller?.id,
      sellerBusinessName: result.seller?.businessName,
      sellerStatus: result.seller?.status,
      customerId: result.customer?.id,
    },
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      seller: true,
      customer: true,
    },
  });

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  // Get permissions for user role
  const permissions = await prisma.permission.findMany();
  const userPermissions = permissions
    .filter((p) => {
      try {
        const roles = JSON.parse(p.rolesJson);
        return Array.isArray(roles) && roles.includes(user.role);
      } catch {
        return false;
      }
    })
    .map((p) => p.name);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      sellerId: user.seller?.id,
      sellerBusinessName: user.seller?.businessName,
      sellerStatus: user.seller?.status,
      customerId: user.customer?.id,
      permissions: userPermissions,
    },
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  if (req.user) {
    await logAudit({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'LOGOUT',
      entity: 'Auth',
      entityId: String(req.user.id),
      ipAddress: req.ip,
    });
  }
  res.json({ success: true, message: 'Logged out successfully' });
};
