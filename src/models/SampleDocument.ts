import { model, Schema } from 'mongoose';

export const sampleDocumentSchema = new Schema(
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
            require_all_of_string: [String],
            require_none_of_string: [String],
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

export const SampleDocumentModel = model(
    'SampleDocument',
    sampleDocumentSchema
);
