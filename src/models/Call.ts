import { Schema, model } from 'mongoose';
import { ICall, IDocument } from '../types';

const documentSchema = new Schema<IDocument>(
    {
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

const CallsSchema = new Schema<ICall>(
    {
        name: { type: String, required: true },
        subHeading: { type: String, default: '' },
        description: { type: String, default: '' },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        // project: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Project',
        //     required: true,
        // },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        questions: {
            type: [String],
            default: null,
        },
        negativeQuestions: {
            type: String,
            default: null,
        },
        positiveQuestions: {
            type: String,
            default: null,
        },
        AIPersona: {
            type: String,
            default: null,
        },
        documents: {
            type: [documentSchema],
            default: [],
        },
        metadata: { type: Schema.Types.Mixed, default: null },
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

export const CallModel = model<ICall>('Call', CallsSchema);
