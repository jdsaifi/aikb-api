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
}

export default DocumentService;
