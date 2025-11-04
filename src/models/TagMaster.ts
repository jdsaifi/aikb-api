import { Schema, model } from 'mongoose';
import { ITagMaster } from '../types';

const TagMasterSchema = new Schema<ITagMaster>(
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

export const TagMasterModel = model<ITagMaster>('TagMaster', TagMasterSchema);
