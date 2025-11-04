import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { documentService } from '../../services/user';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/responseHandler';
import { Pinecone } from '@pinecone-database/pinecone';
import { config } from '../../config';
import { AIService } from '../../services/AIService';
import { IConversation, ITagMaster } from '../../types';
import ConversationService from '../../services/user/ConversationService';

const pc = new Pinecone({
    apiKey: config.pinecone.apiKey,
});

const getIndex = async () =>
    pc.index(config.pinecone.indexName).namespace('default');

const users = {
    1: {
        email: 'user1@demo.com',
        name: 'User One',
        tags: [
            { name: 'Product', description: 'This is tag 1' },
            { name: 'Design', description: 'This is tag 2' },
            { name: 'USA' },
            { name: 'Canada' },
        ],
    },
    2: {
        email: 'user2@demo.com',
        name: 'User Two',
        tags: [
            { name: 'Engineering', description: 'This is tag 1' },
            { name: 'Operations', description: 'This is tag 2' },
            { name: 'R&D' },
        ],
    },
    3: {
        email: 'user3@demo.com',
        name: 'User Three',
        tags: [
            { name: 'Engineering', description: 'This is tag 1' },
            { name: 'India', description: 'This is tag 2' },
            { name: 'UK' },
            { name: 'Germany' },
        ],
    },
};

let searchedRecords: any = {
    result: {
        hits: [
            {
                _id: 'doc70',
                _score: 0.2909276783466339,
                fields: {
                    content:
                        'Design Trends 2025 - Emerging trends include minimalism, 3D graphics, and micro-interactions in UI design.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Emerging trends include minimalism, 3D graphics, and micro-interactions in UI design.',
                    title: 'Design Trends 2025',
                    userGroups: ['Designers'],
                },
            },
            {
                _id: 'doc10',
                _score: 0.22031062841415405,
                fields: {
                    content:
                        'Design Sprint Process - A design sprint is a five-day process to solve product challenges through prototyping and user testing.',
                    source: 'todo',
                    tags: ['Design', 'Product'],
                    text: 'A design sprint is a five-day process to solve product challenges through prototyping and user testing.',
                    title: 'Design Sprint Process',
                    userGroups: ['Designers', 'Product Managers'],
                },
            },
            {
                _id: 'doc45',
                _score: 0.14577904343605042,
                fields: {
                    content:
                        'Designing Wireframes Effectively - Wireframes should focus on layout and structure before visual details.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Wireframes should focus on layout and structure before visual details.',
                    title: 'Designing Wireframes Effectively',
                    userGroups: ['Designers'],
                },
            },
            {
                _id: 'doc35',
                _score: 0.14123119413852692,
                fields: {
                    content:
                        'Design Collaboration with Developers - Designers and developers must share a single source of truth using tools like Figma and Storybook.',
                    source: 'todo',
                    tags: ['Design', 'Engineering'],
                    text: 'Designers and developers must share a single source of truth using tools like Figma and Storybook.',
                    title: 'Design Collaboration with Developers',
                    userGroups: ['Designers', 'Developers'],
                },
            },
            {
                _id: 'doc5',
                _score: 0.14049550890922546,
                fields: {
                    content:
                        'Design Guidelines for Mobile Apps - Designing mobile apps requires following UI/UX principles such as consistency, accessibility, and responsiveness. User feedback loops are critical.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Designing mobile apps requires following UI/UX principles such as consistency, accessibility, and responsiveness. User feedback loops are critical.',
                    title: 'Design Guidelines for Mobile Apps',
                    userGroups: ['Designers', 'Product'],
                },
            },
            {
                _id: 'doc15',
                _score: 0.13966074585914612,
                fields: {
                    content:
                        'Design Accessibility Standards - Accessibility ensures products are usable by people with disabilities. WCAG 2.1 guidelines recommend sufficient color contrast and keyboard navigation.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Accessibility ensures products are usable by people with disabilities. WCAG 2.1 guidelines recommend sufficient color contrast and keyboard navigation.',
                    title: 'Design Accessibility Standards',
                    userGroups: ['Designers'],
                },
            },
            {
                _id: 'doc44',
                _score: 0.13144853711128235,
                fields: {
                    content:
                        'Product Customer Segmentation - Segment customers by demographics, behavior, and needs to design better solutions.',
                    source: 'todo',
                    tags: ['Product', 'Canada'],
                    text: 'Segment customers by demographics, behavior, and needs to design better solutions.',
                    title: 'Product Customer Segmentation',
                    userGroups: ['Product Managers'],
                },
            },
            {
                _id: 'doc20',
                _score: 0.12774500250816345,
                fields: {
                    content:
                        'Designing for Global Users - Designing for global users requires localization, cultural sensitivity, and regional compliance checks.',
                    source: 'todo',
                    tags: ['Design', 'UK', 'Germany', 'India'],
                    text: 'Designing for global users requires localization, cultural sensitivity, and regional compliance checks.',
                    title: 'Designing for Global Users',
                    userGroups: ['Designers'],
                },
            },
            {
                _id: 'doc40',
                _score: 0.11673916131258011,
                fields: {
                    content:
                        'Design Workshop Facilitation Guide - Effective workshops require clear objectives, timed activities, and active participation.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Effective workshops require clear objectives, timed activities, and active participation.',
                    title: 'Design Workshop Facilitation Guide',
                    userGroups: ['Designers', 'Product Managers'],
                },
            },
            {
                _id: 'doc55',
                _score: 0.10571732372045517,
                fields: {
                    content:
                        'Designing Cross-Platform Apps - Cross-platform design requires adaptive layouts and consistent branding.',
                    source: 'todo',
                    tags: ['Design'],
                    text: 'Cross-platform design requires adaptive layouts and consistent branding.',
                    title: 'Designing Cross-Platform Apps',
                    userGroups: ['Designers'],
                },
            },
        ],
    },
    usage: {
        readUnits: 1,
        embedTotalTokens: 10,
    },
};

export const getConversations = asyncHandler(
    async (req: Request, res: Response) => {
        const { user } = res.locals;
        const conversationService = new ConversationService();
        const conversations = await conversationService.getConversations(
            user._id
        );
        res.success(StatusCodes.OK, conversations);
    }
);

export const getConversation = asyncHandler(
    async (req: Request, res: Response) => {
        const { conversationId } = req.params;
        const { user } = res.locals;
        const conversationService = new ConversationService();
        const conversation = await conversationService.getConversation(
            conversationId,
            user._id
        );
        res.success(StatusCodes.OK, conversation);
    }
);

// query kb documents
export const queryKB = asyncHandler(async (req: Request, res: Response) => {
    consoleLog.log('Received a request at /users/documents');
    const { user } = res.locals;
    const body = req.body;

    const { conversationId, query } = body;

    // todo:
    // 1. save conversation in the database [x]
    // 2. use conversation id to get the conversation [x]
    // 3. use conversation history to get the context
    // 4. use context to generate the response
    // 5. save the response in the database
    // 6. return the response

    // const user = users[userId as keyof typeof users];
    if (!user) {
        throw new ApiError({
            httpCode: StatusCodes.BAD_REQUEST,
            description: 'Invalid user ID',
        });
    }

    consoleLog.log('User:', user);
    consoleLog.log('Query:', query);

    const conversationService = new ConversationService();

    const conversation = await conversationService.saveConversation(
        conversationId,
        user._id,
        { role: 'user', content: query }
    );

    // return consoleLog.log('Conversation:', conversation);

    const userTags = user.tags.map((tag: ITagMaster) => tag.name);
    // return res.success(StatusCodes.OK, {
    //     userTags,
    //     user,
    //     query,
    // });

    const index = await getIndex();
    const searchedRecords = await index.searchRecords({
        query: {
            topK: 10,
            inputs: { text: query },
            filter: {
                tags: { $in: userTags },
            },
        },
    });

    const kbDocuments = searchedRecords.result.hits
        .map((doc: any) => {
            return `Title: ${doc.fields.title} Content:${doc.fields.content}`;
        })
        .join('\n---\n');

    const aiService = new AIService();
    const result = await aiService.generateQueryResponse(
        query,
        kbDocuments,
        conversation?.history
    );

    conversationService.saveConversation(
        conversation?._id as string,
        user._id,
        { role: 'assistant', content: result }
    );

    // const result = await documentService.listAll(user);
    res.success(StatusCodes.OK, {
        query,
        conversationId: conversation?._id,
        response: result,
        searchedRecords,
    });
}); // end
