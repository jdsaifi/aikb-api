import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { Request, Response } from 'express';
import { userGroupService } from '../../services/user';
import { IUserGroup } from '../../types';
import { ApiError } from '../../utils/responseHandler';

/**
 * all user groups
 */
export const userAllUserGroups = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/user-groups');
        const { user } = res.locals;

        const result = await userGroupService.allUserGroups(user);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * create user group
 */
export const userCreateUserGroup = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at post /users/user-groups');
        const { user } = res.locals;
        const body = req.payload.body;
        const data = {
            company: user.company.id,
            ...body,
        };
        console.log('create user group data: ', data);
        const result = await userGroupService.createUserGroup(
            data as IUserGroup
        );
        res.success(StatusCodes.CREATED, result);
    }
);
// end

/**
 * get user group by id
 */
export const userGetUserGroupById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at get /users/user-groups/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const result = await userGroupService.getUserGroupById(user, id);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * update user group
 */
export const userUpdateUserGroup = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at put /users/user-groups/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const body = req.payload.body;
        const data = {
            ...body,
        };
        consoleLog.log('update user group data: ', data);
        const result = await userGroupService.updateUserGroup(user, id, data);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * delete user group
 */
export const userDeleteUserGroup = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at delete /users/user-groups/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const result = await userGroupService.deleteUserGroup(user, id);
        res.success(StatusCodes.OK, result);
    }
);
// end
