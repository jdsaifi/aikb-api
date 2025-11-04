import { Schema, model } from 'mongoose';
import { ITagMaster } from '../types';

const DemoTagMasterSchema = new Schema<ITagMaster>(
    {
        name: { type: String, required: true },
        key: { type: String, required: true },
        value: { type: String, required: true },
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

export const DemoTagMasterModel = model<ITagMaster>(
    'DemoTagMaster',
    DemoTagMasterSchema,
    'demo_tagmasters'
);
