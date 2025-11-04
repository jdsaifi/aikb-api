import { Schema, model } from 'mongoose';
import { IProjects } from '../types';

const ProjectsSchema = new Schema<IProjects>(
    {
        name: { type: String, required: true },
        subHeading: { type: String, default: '' },
        description: { type: String, default: '' },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        isPublic: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: null,
            },
        ],
        calls: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Call',
                default: null,
            },
        ],
        deletedAt: { type: Date, default: null },
        deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
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

export const ProjectModel = model<IProjects>('Project', ProjectsSchema);
