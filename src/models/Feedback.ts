import { Schema, model } from 'mongoose';
import { IFeedback, ITranscript } from '../types';

const transcriptSchema = new Schema<ITranscript>(
    {
        role: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
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

const FeedbackSchema = new Schema<IFeedback>(
    {
        company: { type: Schema.Types.ObjectId, ref: 'Company' },
        project: { type: Schema.Types.ObjectId, ref: 'Projects' },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        call: { type: Schema.Types.ObjectId, ref: 'Call' },
        transcript: [transcriptSchema],
        feedback: { type: String, default: null },
        feedbackDate: { type: Date, default: null },
        audio: { type: String, default: null },
        isActive: { type: Boolean, default: true },
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

export const FeedbackModel = model<IFeedback>('Feedback', FeedbackSchema);
