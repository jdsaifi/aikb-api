// models/Module.ts

import mongoose, { Schema } from 'mongoose';
import { IModule } from '../types';

const moduleSchema = new Schema<IModule>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        availablePermissions: [
            {
                type: String,
                required: true,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ModuleModel = mongoose.model<IModule>('Module', moduleSchema);
