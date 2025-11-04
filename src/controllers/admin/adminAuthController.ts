import { CookieOptions, Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { config } from '../../config';
import { StatusCodes } from 'http-status-codes';
import { adminAuthService } from '../../services/admin';

/**
 * add admin
 */
export const addAdmin = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /admin/add');
    consoleLog.log('req.body:', req.body);
    const { email, password } = req.body;

    const data = {
        email,
        password,
    };

    const result = await adminAuthService.createAdmin(data);

    // Here you would typically handle the logic to add an admin
    // For now, we will just return a success response

    res.success(201, result);
}); // END

/**
 * login
 */
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /admin/login');
    consoleLog.log('req.body:', req.body);
    const { email, password } = req.body;
    const result = await adminAuthService.login(email, password);
    // const result = await adminService.login(email, password);

    const cookieOptions: CookieOptions = {
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure,
        maxAge: config.sessionCookie.maxAge,
        domain: config.sessionCookie.domain,
        sameSite: 'lax',
        path: config.sessionCookie.path || '/',
    };

    res.cookie('access_token', result.token, cookieOptions);
    res.success(201, result);
}); // END

/**
 * login
 */
export const adminLogout = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /admin/logout');
    const cookieOptions: CookieOptions = {
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure,
        maxAge: config.sessionCookie.maxAge,
        domain: config.sessionCookie.domain,
        sameSite: 'lax',
        path: config.sessionCookie.path || '/',
    };
    res.clearCookie('access_token', cookieOptions);
    return res.success(StatusCodes.OK);
}); // END

/**
 * admin dashboard
 */
export const adminDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /admin/dashboard');
        consoleLog.log('res.locals.user:', res.locals.admin);
        return res.success(StatusCodes.OK);
    }
); // END
