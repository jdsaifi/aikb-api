import { model, Schema } from 'mongoose';

export const demoDocumentSchema = new Schema(
    {
        heading: { type: String, required: true },
        subHeading: { type: String, default: '' },
        description: { type: String, default: '' },
        content: {
            type: String,
            default: null,
        },
        policy: {
            allow_any_of_string: [String],
            // require_all_of_string: [String],
            // require_none_of_string: [String],
        },
        isChunked: { type: Boolean, default: false },
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

export const DemoDocumentModel = model(
    'DemoSampleDocument',
    demoDocumentSchema,
    'demo_documents'
);
