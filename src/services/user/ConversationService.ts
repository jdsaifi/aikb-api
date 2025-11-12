import { ConversationModel } from '../../models/Conversation';
import { LLMModel } from '../../models/LLM';
import {
    IConversationHistory,
    IConversationHistoryReference,
    IUser,
} from '../../types';
import { toMongoId } from '../../utils/helpers';

class ConversationService {
    constructor() {}

    private async createConversation(
        userId: string,
        history: { role: 'user' | 'assistant'; content: string }[]
    ) {
        const conversation = await ConversationModel.create({
            user: userId,
            history,
        });
        return conversation;
    }

    public async getConversations(userId: string) {
        return await ConversationModel.find({ user: toMongoId(userId) }).sort({
            createdAt: -1,
        });
    }

    public async getConversation(conversationId: string, userId: string) {
        return await ConversationModel.findOne({
            _id: toMongoId(conversationId),
            user: toMongoId(userId),
        });
    }

    private async pushConversationHistory(
        conversationId: string,
        userId: string,
        history: {
            role: 'user' | 'assistant';
            content: string;
            references?: IConversationHistoryReference[];
        }
    ) {
        return await ConversationModel.findOneAndUpdate(
            {
                _id: toMongoId(conversationId),
                user: toMongoId(userId),
            },
            { $push: { history } },
            { new: true }
        );
    }

    async saveConversation(
        conversationId: string,
        userId: string,
        history: {
            role: 'user' | 'assistant';
            content: string;
            references?: IConversationHistoryReference[];
        }
    ) {
        if (!conversationId) {
            return this.createConversation(userId, [history]);
        }

        const hasConversation = await this.getConversation(
            conversationId,
            userId
        );
        if (!hasConversation) {
            return this.createConversation(userId, [history]);
        }

        const conversation = await this.pushConversationHistory(
            conversationId,
            userId,
            history
        );
        return conversation;
    }
}

export default ConversationService;
