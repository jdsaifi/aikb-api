import asyncHandler from '../../utils/asyncHandler';
import { Request, Response } from 'express';
import { consoleLog } from '../../utils/consoleLog';
import { userService } from '../../services/user';

// list all users
export const adminListAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /admins/users');
        const result = await userService.listUsers({
            role: 'user',
            deletedAt: null,
        });
        res.success(200, result);
    }
); // END
