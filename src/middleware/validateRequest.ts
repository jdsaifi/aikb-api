import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject, ZodIssue } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/responseHandler';
import { Logger } from '../utils/logger';
import { consoleLog } from '../utils/consoleLog';

const validateRequest =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            consoleLog.log('\n==================================\n');
            consoleLog.log('######### Body Requests #########\n');
            consoleLog.log(req.body);

            consoleLog.log('\n\n######### Params Requests #########\n');
            consoleLog.log(req.params);

            consoleLog.log('\n\n######### Query Requests #########\n');
            consoleLog.log(req.query);
            consoleLog.log('\n==================================\n\n');

            const data = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            req.payload = data;
            return next();
        } catch (error) {
            Logger.error('[Validate Request Error]', error);

            if (error instanceof ZodError) {
                const errorMessages: string[] = error.errors.map(
                    (issue: ZodIssue) =>
                        `${issue?.path.join('.')} is ${issue?.message}`
                );

                res.error(StatusCodes.BAD_REQUEST, errorMessages);
            } else {
                res.error(StatusCodes.BAD_REQUEST, ['Internal Server Error']);
            }
        }
    };

export const validateZodSchema = async (schema: AnyZodObject, body: object) => {
    try {
        await schema.parseAsync(body);
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages: string[] = error.errors.map(
                (issue: ZodIssue) =>
                    `${issue?.path.join('.')} is ${issue?.message}`
            );

            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: errorMessages[0],
            });
        } else {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Internal Server Error',
            });
        }
    }
};

export default validateRequest;
