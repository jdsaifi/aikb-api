import { StatusCodes } from 'http-status-codes';
import { AdminModel } from '../../models';
import { ApiError } from '../../utils/responseHandler';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../../models';
import { IUser } from '../../types';
import { generateJwtToken } from '../../utils/helpers';
import { consoleLog } from '../../utils/consoleLog';

class UserAuthService {
    /**
     * user login
     */
    async login(
        email: string,
        password: string
    ): Promise<{ token: string; user: IUser }> {
        const user = await UserModel.findOne({ email })
            .select('-__v')
            .populate('company')
            .populate({
                path: 'userGroup',
                populate: {
                    path: 'permissions.module',
                    select: 'name displayName',
                },
            });
        if (!user) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'User not found',
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Invalid email or password',
            });
        }

        const token = generateJwtToken(user?._id as string);
        const userData = user.toObject(); // Convert Mongoose document to plain object
        userData.password = '';
        return { token, user: userData };
    } // END

    /**
     * login with google
     */
    async loginWithGoogle(body: {
        email: string;
        name: string;
        googleId: string;
        emailVerified: boolean;
    }) {
        let user = await UserModel.findOne({
            email: body.email,
            deletedAt: null,
        })
            .select('-__v')
            .populate('company')
            .populate({
                path: 'userGroup',
                populate: {
                    path: 'permissions.module',
                    select: 'name displayName',
                },
            });

        consoleLog.log('login with google user: ', user);
        if (!user) {
            consoleLog.log('\n\nuser not found, creating new user');
            const inputData = {
                ...body,
                company: config.publicCompany.companyId,
                userGroup: config.publicCompany.userGroupId,
                password: new Date().getTime().toString(),
            };
            consoleLog.log('\n\ninputData: ', inputData);
            // create new user with public company
            const newUser = await UserModel.create(inputData);
            user = newUser;
        }

        if (!user.googleId) {
            // Link existing account with Google
            user.googleId = body.googleId;
            user.authProvider = 'google';
            user.emailVerified = body.emailVerified;
            await user.save();
        }

        const token = generateJwtToken(user?._id as string);
        const userData = user.toObject(); // Convert Mongoose document to plain object
        userData.password = '';
        return { token, user: userData };
    } // END
}
export default UserAuthService;
