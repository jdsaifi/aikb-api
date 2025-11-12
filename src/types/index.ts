import { Document, Types } from 'mongoose';

export interface IModule extends Document {
    name: string;
    displayName: string;
    availablePermissions: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPermission {
    module: Types.ObjectId | IModule;
    actions: string[];
}

export interface ITagMaster extends Document {
    name: string;
    key: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserGroup extends Document {
    company: Types.ObjectId | ICompany;
    name: string;
    description?: string;
    permissions: IPermission[];
    isActive: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    company?: Types.ObjectId;
    userGroup: Types.ObjectId | IUserGroup;
    authProvider: 'google' | 'credentials';
    googleId: string;
    emailVerified: boolean;
    // tags: Types.ObjectId[] | ITagMaster[] | null;
    tags: string[] | null;
    isActive: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICompany extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProjects extends Document {
    name: string;
    subHeading: string;
    description?: string;
    company: Types.ObjectId | ICompany;
    isPublic: boolean;
    isActive: boolean;
    createdBy: Types.ObjectId | IUser;
    members: Types.ObjectId[] | IUser[] | null;
    calls: Types.ObjectId[] | ICall[] | null;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

// export interface IDocumentPolicy extends Document {
//     allow_any_of: string[];
//     require_all_of: string[];
//     require_none_of: string[];
//     createdAt: Date;
//     updatedAt: Date;
// }

export interface IDocument extends Document {
    heading: string;
    subHeading: string;
    description: string;
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
    content?: string;
    parsed_at?: Date;
    metadata: any | null;
    policy: {
        allow_any_of: ITagMaster[];
        require_all_of: ITagMaster[];
        require_none_of: ITagMaster[];
    };
    createdBy: Types.ObjectId | IUser;
    isPublic: boolean;
    isActive: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDemoDocument extends Document {
    heading: string;
    subHeading: string;
    description: string;
    content: string;
    policy: {
        allow_any_of: ITagMaster[];
    };
    isChunked: boolean;
    // createdBy: Types.ObjectId | IUser;
    // isActive: boolean;
    // deletedAt?: Date;
    // deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICall extends Document {
    name: string;
    subHeading: string;
    description?: string;
    company: Types.ObjectId | ICompany;
    // project: Types.ObjectId | IProjects;
    createdBy: Types.ObjectId | IUser;
    questions: string[] | null;
    negativeQuestions: string | null;
    positiveQuestions: string | null;
    AIPersona: string | null;
    documents: IDocument[] | null;
    metadata: any | null;
    isPublic: boolean;
    isActive: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITranscript extends Document {
    role: string;
    content: string;
}

export interface IFeedback extends Document {
    company: Types.ObjectId | ICompany;
    project: Types.ObjectId | IProjects;
    user: Types.ObjectId | IUser;
    call: Types.ObjectId | ICall;
    transcript: ITranscript[];
    feedback: string | null;
    feedbackDate: Date | null;
    audio: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAddCompany {}

/************************
 *
 * Types
 */

export interface IAddDocumentInput {
    heading: string;
    subHeading: string;
    description: string;
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
    content?: string;
    metadata: any | null;
    createdBy: Types.ObjectId | IUser;
    isPublic: boolean;
}

export interface IConversationHistoryReference extends Document {
    id: string;
    title: string;
    preview: string;
    url: string;
}

export interface IConversationHistory extends Document {
    role: 'user' | 'assistant';
    content: string;
    references: IConversationHistoryReference[] | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IConversation extends Document {
    user: Types.ObjectId | IUser;
    history: IConversationHistory[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ILLMModel {
    provider:
        | 'openai'
        | 'anthropic'
        | 'google'
        | 'azure'
        | 'meta'
        | 'nvidia'
        | 'other';
    title: string;
    model: string;
    isActive: boolean;
    sort: number;
    createdAt: Date;
    updatedAt: Date;
}
