import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from '../types';
import bcrypt from 'bcryptjs';

// export interface IUser extends Document {
//     name: string;
//     email: string;
//     password: string;
//     role: 'user' | 'admin';
//     company?: Types.ObjectId; // Optional, null for individuals
//     // assignedProjects: Types.ObjectId[];
// }

// (async () => {
//     const hash = await bcrypt.hash('123456', 10);
//     console.log('Hashed password:', hash);
// })();

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: false, // Optional, null for individuals
            default: null,
        },
        userGroup: {
            type: Schema.Types.ObjectId,
            ref: 'UserGroup',
            required: false,
            default: null, // Optional, null for individuals
        },
        authProvider: {
            type: String,
            enum: ['google', 'credentials'],
            default: 'credentials',
        },
        googleId: {
            type: String,
            required: false,
            default: null,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        // tags: {
        //     type: [{ type: Schema.Types.ObjectId, ref: 'TagMaster' }],
        //     default: null,
        // },
        tags: {
            type: [String],
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // assignedProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    },
    { timestamps: true }
);

UserSchema.index({ email: 1, company: 1 }, { unique: true });

// convert password to hash before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

export const UserModel = model<IUser>('User', UserSchema);
