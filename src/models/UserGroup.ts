// models/UserGroup.ts
import mongoose, { Schema } from 'mongoose';
import { IUserGroup } from '../types';

const userGroupSchema = new Schema<IUserGroup>(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        permissions: [
            {
                module: {
                    type: Schema.Types.ObjectId,
                    ref: 'Module',
                    required: true,
                },
                actions: [
                    {
                        type: String,
                        required: true,
                    },
                ],
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const UserGroupModel = mongoose.model<IUserGroup>(
    'UserGroup',
    userGroupSchema
);
