import { model, Schema } from 'mongoose';
import { IDocument } from '../types';

export const documentSchema = new Schema<IDocument>(
    {
        heading: { type: String, required: true },
        subHeading: { type: String, default: '' },
        description: { type: String, default: '' },
        filename: {
            type: String,
            required: true,
        },
        originalname: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        mimetype: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        content: {
            type: String,
            default: null,
        },
        parsed_at: {
            type: Date,
            default: null,
        },
        metadata: { type: Schema.Types.Mixed, default: null },
        policy: {
            // allow_any_of: [
            //     {
            //         type: Schema.Types.ObjectId,
            //         ref: 'TagMaster',
            //         default: null,
            //     },
            // ],
            // require_all_of: [
            //     {
            //         type: Schema.Types.ObjectId,
            //         ref: 'TagMaster',
            //         default: null,
            //     },
            // ],
            // require_none_of: [
            //     {
            //         type: Schema.Types.ObjectId,
            //         ref: 'TagMaster',
            //         default: null,
            //     },
            // ],

            allow_any_of_string: [String],
            require_all_of_string: [String],
            require_none_of_string: [String],
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isPublic: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
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

export const DocumentModel = model<IDocument>('Document', documentSchema);
