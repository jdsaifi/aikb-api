import { AdminModel } from '../models';
import { config } from '../config';
import { ApiError } from '../utils/responseHandler';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { NextFunction, Request, Response } from 'express';
import { consoleLog } from '../utils/consoleLog';

export const authorizeAdminRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token: string =
            req.cookies?.access_token ||
            req.headers['x-access-token'] ||
            req.header('Authorization')?.replace('Bearer ', '') ||
            req.body?.access_token ||
            req.query?.access_token;

        if (!token) {
            throw new ApiError({
                httpCode: StatusCodes.UNAUTHORIZED,
                description: 'Invalid access token',
            });
        }

        try {
            const tokenKey: string = config.jwtSecret || 'NOSECRET';
            const decoded: JwtPayload | string = verify(token, tokenKey);
            const { sub } = decoded;
            consoleLog.log('Token:', token);
            consoleLog.log('decoded:', decoded);
            const admin = await AdminModel.findById(sub);

            if (!admin) {
                throw new ApiError({
                    httpCode: StatusCodes.UNAUTHORIZED,
                    description: 'Invalid access token',
                });
            }

            // Attach user information to the request
            res.locals.admin = {
                id: admin?.id,
            };
            next();
        } catch (err) {
            Logger.error({
                event: '[Admin Auth Middleware Error]',
                error: err,
            });

            throw new ApiError({
                httpCode: StatusCodes.UNAUTHORIZED,
                description: 'Invalid access token',
            });
        }
    }
);
