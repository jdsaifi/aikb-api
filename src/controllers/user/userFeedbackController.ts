import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { userFeedbackService } from '../../services/user';
import { StatusCodes } from 'http-status-codes';

/**
 * get feedback record for the user
 */
export const userGetFeedback = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/:projectId/calls/:callId/feedbacks'
        );
        const { user } = res.locals;
        const { projectId, callId } = req.payload.params;
        consoleLog.log('project id: ', projectId);
        consoleLog.log('call id: ', callId);
        const result = await userFeedbackService.getUserFeedback(
            projectId,
            callId,
            user
        );
        res.success(StatusCodes.OK, result);
    }
); // END

export const userUpdateFeedbackTranscript = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /v1/users/projects/:projectId/calls/:callId/feedbacks/:feedbackId/transcripts'
        );
        const { user } = res.locals;
        const { projectId, callId, feedbackId } = req.payload.params;
        const { transcript } = req.payload.body;
        consoleLog.log('project id: ', projectId);
        consoleLog.log('call id: ', callId);
        consoleLog.log('feedback id: ', feedbackId);

        const result = await userFeedbackService.updateFeedbackTranscript(
            projectId,
            callId,
            feedbackId,
            user,
            transcript
        );

        res.success(StatusCodes.OK, result);
    }
);
