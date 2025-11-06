import { Schema, model } from 'mongoose';
import { IConversation, IConversationHistory } from '../types';
import { IConversationHistoryReference } from '../types';

const conversationHistoryReferenceSchema =
    new Schema<IConversationHistoryReference>({
        id: { type: String, required: true },
        title: { type: String, required: true },
        preview: { type: String, required: true },
        url: { type: String, required: true },
    });

const conversationHistorySchema = new Schema<IConversationHistory>(
    {
        role: { type: String, required: true },
        content: { type: String, required: true },
        references: {
            type: [conversationHistoryReferenceSchema],
            default: null,
        },
    },
    { timestamps: true }
);

const ConversationSchema = new Schema<IConversation>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        history: { type: [conversationHistorySchema], required: true },
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

export const ConversationModel = model<IConversation>(
    'Conversation',
    ConversationSchema
);
