import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { settingsUpdateSchema } from '../validators/schemas';
import { logAudit } from '../utils/auditLogger';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  let settings = await prisma.platformSettings.findFirst();

  if (!settings) {
    settings = await prisma.platformSettings.create({
      data: {
        id: 1,
        platformName: 'HerCart',
        tagline: 'Affordable Digital Commerce for Every Seller',
        defaultCommissionRate: 2.0,
        defaultGstRate: 5.0,
        shippingFeeFlat: 50.0,
        freeShippingThreshold: 999.0,
        currencySymbol: '₹',
        supportEmail: 'support@hercart.demo',
      },
    });
  }

  res.json({ success: true, data: settings });
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  const validated = settingsUpdateSchema.parse(req.body);

  const existing = await prisma.platformSettings.findFirst();

  const updated = await prisma.platformSettings.upsert({
    where: { id: 1 },
    update: validated,
    create: {
      id: 1,
      ...validated,
    },
  });

  await logAudit({
    userId: req.user?.id,
    userName: req.user?.name,
    userRole: req.user?.role,
    action: 'UPDATE_SETTINGS',
    entity: 'Settings',
    entityId: '1',
    details: {
      oldCommission: existing?.defaultCommissionRate,
      newCommission: updated.defaultCommissionRate,
      changes: validated,
    },
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    message: 'Platform settings updated successfully',
    data: updated,
  });
};
