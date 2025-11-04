import { CallModel, ProjectModel } from '../../models';
import { ICall, IUser } from '../../types';

import { ApiError } from '../../utils/responseHandler';
import { CallInput } from '../../validations/schema';
import { StatusCodes } from 'http-status-codes';
import { AIService } from '../AIService';

class UserCallService {
    constructor() {}

    /** create call */
    async createCall(input: Partial<CallInput>): Promise<ICall> {
        const newCall = await CallModel.create(input);

        const aiService = new AIService();
        const result = await aiService.generateCallQuestions(newCall);

        newCall?.set({
            questions: result,
        });

        await newCall?.save();
        return newCall;
    } // END

    /** get call list */
    async list(user: IUser) {
        // let condition: any = {
        //     $and: [
        //         { _id: projectId },
        //         { deletedAt: null },
        //         { $or: [{ createdBy: user._id }, { members: user._id }] },
        //     ],
        // };

        // if (user.role === 'admin') {
        //     condition = {
        //         $and: [{ _id: projectId }, { deletedAt: null }],
        //     };
        // }

        // const project = await ProjectModel.findOne(condition);
        // if (!project) {
        //     throw new ApiError({
        //         httpCode: StatusCodes.NOT_FOUND,
        //         description: 'Project not found',
        //     });
        // }

        return await CallModel.find({
            company: user.company,
            deletedAt: null,
        })
            .select('name description company createdBy createdAt isActive')
            .populate('company', 'name')
            .populate('createdBy', 'name email')
            .sort({
                createdAt: -1,
            });
    } // END

    /** get call list */
    async listUnderProject(projectId: string, user: IUser) {
        let condition: any = {
            $and: [
                { _id: projectId },
                { deletedAt: null },
                { $or: [{ createdBy: user._id }, { members: user._id }] },
            ],
        };

        if (user.role === 'admin') {
            condition = {
                $and: [{ _id: projectId }, { deletedAt: null }],
            };
        }

        const project = await ProjectModel.findOne(condition);
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        // get all calls under the project
        return await CallModel.find({
            $and: [{ _id: { $in: project.calls } }, { deletedAt: null }],
        })
            .select('name description company createdBy createdAt isActive')
            .populate('company', 'name')
            .populate('createdBy', 'name email')
            .sort({
                createdAt: -1,
            });
    } // END

    /** get all calls */
    async allCalls(projectId: string, user: IUser) {
        let condition: any = {
            _id: projectId,
            $and: [{ $or: [{ createdBy: user._id }, { members: user._id }] }],
        };

        if (user.role === 'admin') {
            condition = {
                _id: projectId,
            };
        }

        const project = await ProjectModel.findOne(condition);
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        return await CallModel.find({ project: project._id }).sort({
            createdAt: -1,
        });
    } // END

    /** get call by id */
    async getCallById(callId: string, user: IUser): Promise<ICall | null> {
        const call = await CallModel.findOne({
            _id: callId,
            company: user.company,
        })
            .select('-__v')
            .populate('company', 'name')
            .populate('createdBy', 'name email');
        // .populate('project', 'name description isActive');

        return call;
    } // END

    /** update call */
    async update(
        // projectId: string,
        callId: string,
        user: IUser,
        input: Partial<ICall>
    ): Promise<ICall | null> {
        // let condition: any = {
        //     _id: projectId,
        //     $and: [{ $or: [{ createdBy: user._id }, { members: user._id }] }],
        // };

        // if (user.role === 'admin') {
        //     condition = {
        //         _id: projectId,
        //     };
        // }

        // const project = await ProjectModel.findOne(condition);

        // if (!project) {
        //     throw new ApiError({
        //         httpCode: StatusCodes.NOT_FOUND,
        //         description: 'Project not found',
        //     });
        // }

        let call = await CallModel.findOne({
            _id: callId,
            company: user.company,
        });

        if (!call) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Call not found',
            });
        }

        if (input?.documents && input.documents.length > 0) {
            // push new document
            const { documents, ...restInput } = input;

            const updatedCall = await CallModel.findOneAndUpdate(
                {
                    _id: callId,
                },
                {
                    $set: restInput,
                    $push: {
                        documents: { $each: documents },
                    },
                },
                { new: true }
            );
            call = updatedCall;
        } else {
            call?.set(input);
            await call?.save();
        }

        const aiService = new AIService();
        const result = await aiService.generateCallQuestions(call as ICall);

        call?.set({
            questions: result,
        });
        await call?.save();

        return call;
    } // END

    /** delete call */
    async delete(projectId: string, callId: string, user: IUser) {
        const project = await ProjectModel.findOne({
            $and: [
                { _id: projectId },
                { company: user.company },
                { deletedAt: null },
                { $or: [{ createdBy: user._id }, { members: user._id }] },
            ],
        });

        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        const call = await CallModel.findOne({
            $and: [
                { _id: callId },
                { project: project._id },
                { deletedAt: null },
            ],
        });

        if (!call) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Call not found',
            });
        }

        const updatedCall = await CallModel.findOneAndUpdate(
            { _id: call },
            { deletedAt: new Date(), deletedBy: user._id },
            { new: true }
        );

        return updatedCall;
    } // END

    /** list public calls */
    async listPublicCalls() {
        const calls = await CallModel.find({
            isPublic: true,
            deletedAt: null,
        })
            .select('-deletedAt -deletedBy')
            .populate('company', 'name')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        return calls;
    } // END
}

export default UserCallService;
