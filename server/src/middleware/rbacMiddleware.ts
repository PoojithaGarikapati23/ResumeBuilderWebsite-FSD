import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access denied for role ${req.user.role}`,
      });
      return;
    }

    next();
  };
};

export const requireSuperAdmin = authorizeRoles('SUPER_ADMIN');
export const requireAdminOrStaff = authorizeRoles('SUPER_ADMIN', 'STAFF');
export const requireSellerOrAdmin = authorizeRoles('SUPER_ADMIN', 'SELLER', 'STAFF');
