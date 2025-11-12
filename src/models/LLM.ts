// meta-llama/llama-3.3-8b-instruct:free

import { Schema, model } from 'mongoose';
import { ILLMModel } from '../types';

const LLMModelSchema = new Schema<ILLMModel>(
    {
        provider: { type: String, required: true },
        title: { type: String, required: true },
        model: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        sort: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

export const LLMModel = model<ILLMModel>('LLMModel', LLMModelSchema);
