import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { consoleLog } from '../utils/consoleLog';
import { Request, Response } from 'express';
import { ModuleModel } from '../models/Module';

/**
 * all user groups
 */
export const allModules = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /modules');
    const { user } = res.locals;

    const result = await ModuleModel.find({});
    res.success(StatusCodes.OK, result);
});
// end

/** create modules */
export const createModules = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /modules');
        const { user } = res.locals;

        const permissions = [
            {
                name: 'users',
                displayName: 'Users Module',
                availablePermissions: ['view', 'create', 'update', 'delete'],
            },
            {
                name: 'user-groups',
                displayName: 'User Groups Module',
                availablePermissions: ['view', 'create', 'update', 'delete'],
            },
        ];

        const result = await ModuleModel.insertMany(permissions);
        res.success(StatusCodes.OK, result);
    }
);
//end
