import { Request, Response } from 'express';

import { ModuleInput } from '../../validations/schema';
import { ModuleModel } from '../../models';
import asyncHandler from '../../utils/asyncHandler';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/responseHandler';

export const createModule = asyncHandler(
    async (req: Request<{}, {}, ModuleInput>, res: Response): Promise<void> => {
        try {
            const module = new ModuleModel(req.payload.body);
            await module.save();
            res.success(StatusCodes.CREATED, module);
            // res.success(201);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ApiError({
                    httpCode: StatusCodes.BAD_REQUEST,
                    description: 'Module name already exists',
                });
            }
            throw new ApiError({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                description:
                    error.message ||
                    'An error occurred while creating the module',
            });
        }
    }
); // END

export const getModules = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const modules = await ModuleModel.find({ isActive: true });
        res.json(modules);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getModuleById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const module = await ModuleModel.findById(req.params.id);
        if (!module) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }
        res.json(module);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateModule = async (
    req: Request<{ id: string }, {}, ModuleInput>,
    res: Response
): Promise<void> => {
    try {
        const module = await ModuleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!module) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }
        res.json(module);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteModule = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    try {
        const module = await ModuleModel.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!module) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }
        res.json({ message: 'Module deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
