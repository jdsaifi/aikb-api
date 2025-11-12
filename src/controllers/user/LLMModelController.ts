import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../utils/asyncHandler';
import { Request, Response } from 'express';
import { LLMModel } from '../../models/LLM';

export const listLLMModels = asyncHandler(
    async (req: Request, res: Response) => {
        const llmModels = await LLMModel.find({ isActive: true }).sort({
            sort: 1,
        });
        res.success(StatusCodes.OK, llmModels);
    }
);
