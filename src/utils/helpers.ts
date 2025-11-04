import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const toMongoId = (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id as string);
};

export const generateJwtToken = (userId: string): string => {
    return jwt.sign({ sub: userId }, config.jwtSecret, {
        expiresIn: '100Days',
    });
};

// build unique id from text
export const generateUniqueID = (str: string): string => {
    // Choose a hashing algorithm (e.g., 'sha256', 'md5', 'sha1')
    const hash = crypto.createHash('sha256');

    // Update the hash with the text content
    hash.update(str);

    // Get the hexadecimal representation of the hash
    return hash.digest('hex');
};

// check user policy is satisfied
export const isPolicySatisfied = (policy: any, userAttributes: any) => {
    // console.log('\n\nPolicy:', policy);
    // Convert to sets for easier comparison
    const userSet = new Set(userAttributes);

    // ✅ 1. Check allow_any_of_string — if defined, user must have AT LEAST ONE
    if (policy.allow_any_of_string?.length) {
        const hasAnyAllowed = policy.allow_any_of_string.some((attr: any) =>
            userSet.has(attr)
        );
        if (!hasAnyAllowed) return false;
    }

    // ✅ 2. Check require_all_of_string — user must have ALL of them
    if (policy.require_all_of_string?.length) {
        const hasAllRequired = policy.require_all_of_string.every((attr: any) =>
            userSet.has(attr)
        );
        if (!hasAllRequired) return false;
    }

    // ✅ 3. Check require_none_of_string — user must NOT have ANY of them
    if (policy.require_none_of_string?.length) {
        const hasForbidden = policy.require_none_of_string.some((attr: any) =>
            userSet.has(attr)
        );
        if (hasForbidden) return false;
    }

    return true;
};
