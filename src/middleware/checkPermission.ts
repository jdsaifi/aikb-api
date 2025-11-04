import { NextFunction, Request, Response } from 'express';

export const checkPermission = (moduleName: string, action: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { user } = res.locals;

        if (user && user.isActive && user.role === 'admin') {
            // Admins have full access, skip permission check
            next();
            return;
        }

        if (!user || !user.userGroup) {
            res.status(403).json({ error: 'Access denied' });
            return;
        }

        const userGroup = user.userGroup as any;
        const modulePermission = userGroup.permissions.find(
            (p: any) => p.module.name === moduleName
        );

        if (!modulePermission || !modulePermission.actions.includes(action)) {
            res.status(403).json({
                error: `Access denied. Required permission: ${moduleName}.${action}`,
            });
            return;
        }

        next();
    };
};
