import { Types } from 'mongoose';
import { DocumentModel } from '../../models/Document';
import {
    IAddDocumentInput,
    IDocument,
    IDemoDocument,
    IUser,
} from '../../types';
import { DemoDocumentModel } from '../../models/DemoDocument';
import { toMongoId } from '../../utils/helpers';
import { consoleLog } from '../../utils/consoleLog';

export interface IUpdateDocumentInput {
    heading?: string;
    subHeading?: string;
    description?: string;
    content?: string;
    policy?: {
        allow_any_of_string?: string[];
    };
}

export class DocumentService {
    constructor() {}

    /** list all user's documents */
    async listAll(user: IUser): Promise<IDemoDocument[]> {
        // {
        //     isActive: true,
        //     deletedAt: null,
        //     deletedBy: null,
        //     // createdBy: user._id,
        // }
        const documents = await DemoDocumentModel.find<IDemoDocument>({
            isChunked: true,
        })
            .select('-content')
            // .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return documents;
    } // end

    /** add a document */
    async add(input: IAddDocumentInput): Promise<IDocument> {
        const newDocument = await DemoDocumentModel.create(input);
        return newDocument as unknown as IDocument;
    } // end

    /** get a document by id */
    async get(id: string): Promise<IDocument | null> {
        const document = await DemoDocumentModel.findById(toMongoId(id));
        return document as unknown as IDocument;
    } // end

    /** update a document */
    async update(
        id: string,
        input: IUpdateDocumentInput
    ): Promise<IDemoDocument> {
        const updatedDocument = await DemoDocumentModel.findByIdAndUpdate(
            id,
            input,
            {
                new: true,
            }
        );
        return updatedDocument as unknown as IDemoDocument;
    } // end

    /** get list of my documents */
    async myDocuments(user: IUser): Promise<IDemoDocument[]> {
        console.log(
            'Getting list of my documents for user and tags: ',
            user.email,
            user.tags
        );

        const condition = {
            $and: [
                { isChunked: true },
                {
                    'policy.allow_any_of_string': { $in: user.tags || [] },
                },
            ],
        };
        console.log('condition: ', condition);
        const documents = await DemoDocumentModel.find(condition)
            .select('-content') // exclude content from the response
            .sort({ createdAt: -1 });
        return documents as unknown as IDemoDocument[];
    } // end

    /** search my documents */
    async searchMyDocuments(
        query: string,
        tags: string[],
        userTags: string[]
    ): Promise<IDemoDocument[]> {
        let $or: any[] = [];
        if (query) {
            $or = [
                { heading: { $regex: query, $options: 'i' } },
                { subHeading: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } },
            ];
        }

        let tagsFilter: any = tags?.length ? tags : userTags;

        const condition: any = {
            $and: [
                { isChunked: true },
                {
                    'policy.allow_any_of_string': {
                        $in: tagsFilter,
                    },
                },
                { $or: $or?.length ? $or : [] },
            ],
        };
        consoleLog.log('condition: ');
        consoleLog.deep(condition);

        const documents = await DemoDocumentModel.find(condition)
            .select('-content') // exclude content from the response
            .sort({ createdAt: -1 });
        return documents as unknown as IDemoDocument[];
    } // end
}

export default DocumentService;
