import multer, { Multer } from 'multer';
import path from 'path';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/responseHandler';
import fs from 'fs';
import crypto from 'crypto';

// Configure storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const id = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname);
        const newFilename = `${id}${ext}`;
        cb(null, newFilename);
    },
});

// File filter
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Only PDF and DOC files are allowed',
            })
        );
    }
};

// Configure multer
export const upload: Multer = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5, // Maximum 5 files
    },
});
