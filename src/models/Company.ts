import { Schema, model } from 'mongoose';
import { ICompany } from '../types';

const CompanySchema = new Schema<ICompany>(
    {
        name: { type: String, required: true },
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

export const CompanyModel = model<ICompany>('Company', CompanySchema);
