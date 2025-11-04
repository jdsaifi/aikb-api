import { Schema, model } from 'mongoose';
import { IConversation, IConversationHistory } from '../types';

const conversationHistorySchema = new Schema<IConversationHistory>(
    {
        role: { type: String, required: true },
        content: { type: String, required: true },
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
