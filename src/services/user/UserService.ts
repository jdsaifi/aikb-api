import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/responseHandler';
import { UserGroupModel, UserModel } from '../../models';
import { IUser } from '../../types';
import bcrypt from 'bcryptjs';
import { consoleLog } from '../../utils/consoleLog';

class UserService {
    /**
     * self profile
     */
    async selfProfile(userId: string): Promise<IUser> {
        const user = await UserModel.findById(userId)
            .select('-__v -password')
            .populate('company');
        if (!user) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not found',
            });
        }
        return user.toObject(); // Convert Mongoose document to plain object
    } // END

    /**
     * all users
     */
    async allUsers(user: IUser) {
        const users = await UserModel.find({
            company: user.company,
            role: 'user',
            deletedAt: null,
        })
            .select('-__v -password')
            .populate('company')
            .populate({
                path: 'userGroup',
                populate: {
                    path: 'permissions.module',
                    select: 'name displayName',
                },
            })
            .populate('tags')
            .sort({ createdAt: -1 });
        return users;
    } // END

    /**
     * list of all users
     */
    async listUsers(condition?: any) {
        const users = await UserModel.find(condition || {})
            .select('-__v -password')
            .populate('company')
            .populate({
                path: 'userGroup',
                populate: {
                    path: 'permissions.module',
                    select: 'name displayName',
                },
            })
            .populate('tags')
            .sort({ createdAt: -1 });
        return users;
    } // END

    /**
     * get user by id
     */
    async getUserById(user: IUser, userId: string) {
        const userInfo = await UserModel.findOne({
            _id: userId,
            company: user.company,
            role: 'user',
        })
            .select('-__v -password')
            .populate('company')
            .populate({
                path: 'userGroup',
                populate: {
                    path: 'permissions.module',
                    select: 'name displayName',
                },
            });
        if (!userInfo) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not found',
            });
        }
        return userInfo; // Convert Mongoose document to plain object
    } // END

    /**
     * add new user
     */
    async addUser(data: IUser) {
        const userGroup = await UserGroupModel.findById(data.userGroup);
        if (!userGroup) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User group not found',
            });
        }
        if (userGroup.company.toString() !== data.company?.toString()) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'User group does not belong to the company',
            });
        }
        const user = await UserModel.create(data);
        return user;
    } // END

    /**
     * update user
     */
    async updateUser(user: IUser, userId: string, data: IUser) {
        try {
            if (data.password && data.password !== '') {
                data.password = await bcrypt.hash(data.password, 10);
            }
            // check if user has changed his email
            // then check if the email is already in use
            if (data.email) {
                const userWithSameEmail = await UserModel.findOne({
                    email: data.email,
                    company: user.company,
                    _id: { $ne: userId },
                });
                if (userWithSameEmail) {
                    throw new ApiError({
                        httpCode: StatusCodes.BAD_REQUEST,
                        description: 'Email already in use',
                    });
                }
            }
            const userInfo = await UserModel.findOneAndUpdate(
                { _id: userId, company: user.company, role: 'user' },
                data,
                {
                    new: true,
                    select: '-__v -password',
                    populate: [
                        {
                            path: 'userGroup',
                            populate: {
                                path: 'permissions.module',
                                select: 'name displayName',
                            },
                        },
                        // {
                        //     path: 'tags',
                        //     model: 'DemoTagMaster',
                        //     select: 'name key value',
                        // },
                    ],
                }
            );
            if (!userInfo) {
                throw new ApiError({
                    httpCode: StatusCodes.NOT_FOUND,
                    description: 'User not found',
                });
            }
            return userInfo;
        } catch (error) {
            consoleLog.error('Error updating user: ', error);
            throw new ApiError({
                httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
                description: 'Error updating user',
            });
        }
    } // END

    /**
     * delete user
     */
    async deleteUser(user: IUser, userId: string) {
        const userInfo = await UserModel.findOne({
            _id: userId,
            company: user.company,
        });
        if (!userInfo) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not found',
            });
        }

        // update the deletedAt field
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                deletedAt: new Date(),
                deletedBy: user._id,
            },
            {
                new: true,
                select: '-__v -password',
            }
        );

        return updatedUser;
    } // END
}
export default UserService;
