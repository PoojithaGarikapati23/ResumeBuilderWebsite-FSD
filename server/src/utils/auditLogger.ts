import prisma from '../config/prisma';

export interface AuditLogParams {
  userId?: number;
  userName?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

export async function logAudit(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userName: params.userName || 'System',
        userRole: params.userRole || 'SYSTEM',
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ? String(params.entityId) : null,
        detailsJson: params.details ? JSON.stringify(params.details) : null,
        ipAddress: params.ipAddress || '127.0.0.1',
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
