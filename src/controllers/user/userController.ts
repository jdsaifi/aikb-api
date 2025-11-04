import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { Request, Response } from 'express';
import { userService } from '../../services/user';

/**
 * all users
 */
export const userAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users');
        const { user } = res.locals;

        const result = await userService.allUsers(user);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * get user by id
 */
export const userGetUserById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const result = await userService.getUserById(user, id);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * add new user
 */
export const userAddUser = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /users');
    const { user } = res.locals;
    consoleLog.log('\n\n\n user:', user);
    const body = req.payload.body;
    const data = {
        company: user.company.id,
        ...body,
    };
    console.log('add user data: ', data);
    const result = await userService.addUser(data);
    res.success(StatusCodes.CREATED, result);
});
// end

/**
 * update user
 */
export const userUpdateUser = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const body = req.payload.body;
        // return consoleLog.log('update user data: ', body);
        const result = await userService.updateUser(user, id, body);
        consoleLog.log('update user result: ', result);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * delete user
 */
export const userDeleteUser = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/:id');
        const { user } = res.locals;
        const { id } = req.payload.params;
        const result = await userService.deleteUser(user, id);
        res.success(StatusCodes.OK, result);
    }
);
