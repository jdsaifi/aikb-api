import { ApiResponse } from '../utils/responseHandler';
import { Request, Response, NextFunction } from 'express';

const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
    res.success = (code = 200, data = [], metadata = {}, links = {}) => {
        res.status(code).json(new ApiResponse(data, metadata, links));
    };

    res.error = (code: number = 400, messages: string[] | string = []) => {
        res.status(code).json({
            status: 'error',
            error: {
                code,
                messages: Array.isArray(messages) ? messages : [messages],
            },
            metadata: {
                timestamp: new Date().toISOString(),
            },
        });
    };

    next();
};

export default responseFormatter;
