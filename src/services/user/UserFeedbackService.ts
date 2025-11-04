import { StatusCodes } from 'http-status-codes';
import { CallModel, FeedbackModel, ProjectModel } from '../../models';
import { ICall, IUser } from '../../types';
import { ApiError } from '../../utils/responseHandler';
import { consoleLog } from '../../utils/consoleLog';
import { AIService } from '../AIService';

class UserFeedbackService {
    constructor() {}

    /** get feedback record for the user */
    async getUserFeedback(projectId: string, callId: string, user: IUser) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            $and: [{ $or: [{ createdBy: user._id }, { members: user._id }] }],
        });

        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        const call: ICall | null = await CallModel.findOne({
            _id: callId,
            project: project._id,
        });

        if (!call) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Call not found',
            });
        }

        // find feedback by projectId and callId and userId
        // return feedback;
        const feedback = await FeedbackModel.findOne({
            project: project._id,
            call: call._id,
            user: user._id,
        });

        if (!feedback) {
            // feedback not found
            // create new feedback
            const input = {
                company: call.company._id,
                project: project._id,
                call: call._id,
                user: user._id,
            };

            const newFeedback = await FeedbackModel.create(input);
            return newFeedback;
        }

        // if not found create one
        return feedback;
    }
    // end

    // update feedback transcript
    async updateFeedbackTranscript(
        projectId: string,
        callId: string,
        feedbackId: string,
        user: IUser,
        transcript: string
    ) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            $and: [{ $or: [{ createdBy: user._id }, { members: user._id }] }],
        });

        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        const call: ICall | null = await CallModel.findOne({
            _id: callId,
            project: project._id,
        });

        if (!call) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Call not found',
            });
        }

        const feedback = await FeedbackModel.findOne({
            _id: feedbackId,
            project: project._id,
            call: call._id,
            user: user._id,
        });

        if (!feedback) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Feedback not found',
            });
        }

        consoleLog.log('\n\n\n');
        consoleLog.log('transcript: ', transcript);

        // generate feedback from transacript
        let callFeedback = '';
        try {
            const aiService = new AIService();
            callFeedback = await aiService.generateCallFeedback(transcript);
        } catch (err: unknown) {
            consoleLog.log('\n\n\n\n');
            consoleLog.log('ai service error: ', err);
        }

        // set input
        const transcriptData = JSON.parse(transcript);
        const input = {
            transcript: transcriptData,
            feedback: callFeedback,
            feedbackDate: new Date(),
        };
        feedback.set(input);

        // save feedback
        await feedback.save();

        return feedback;
    }
    // end
}

export default UserFeedbackService;
