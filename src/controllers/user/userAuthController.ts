import { CookieOptions, Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { LoginInput } from '../../validations/schema';
import { userAuthService, userService } from '../../services/user';
import { config } from '../../config';
import { ApiError } from '../../utils/responseHandler';
import { StatusCodes } from 'http-status-codes';

/**
 * login
 */
export const userLogin = asyncHandler(
    async (req: Request<{}, {}, LoginInput>, res: Response) => {
        consoleLog.log('Received a request at /users/login');
        consoleLog.log('req.body:', req.payload.body);
        const body: LoginInput = req.payload.body;
        const result = await userAuthService.login(body.email, body.password);

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
    }
); // END

/**
 * logout
 */
export const userLogout = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /users/logout');
    res.clearCookie('access_token', {
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure,
        domain: config.sessionCookie.domain,
        sameSite: 'lax',
        path: config.sessionCookie.path || '/',
    });
    res.success(204, { message: 'User logged out successfully' });
}); // END

/**
 * get user profile
 */
export const userProfile = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /users/profile');
    const { user } = res.locals;

    if (!user) {
        throw new ApiError({
            httpCode: 404,
            description: 'User not found',
        });
    }

    const userProfile = await userService.selfProfile(user.id);
    res.success(200, userProfile);
}); // END

/**
 * login with google
 */
export const userLoginWithGoogle = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/login/google');
        const body = req.payload.body;
        console.log('body: ', body);
        try {
            const result = await userAuthService.loginWithGoogle(body);
            res.success(201, result);
        } catch (error) {
            consoleLog.error('Error in userLoginWithGoogle: ', error);
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Error in userLoginWithGoogle',
            });
        }
    }
);
// end
