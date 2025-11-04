import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { StatusCodes } from 'http-status-codes';
import { toMongoId } from '../../utils/helpers';
import { userCallService } from '../../services/user';
import { ApiError } from '../../utils/responseHandler';
import DocumentParser from '../../utils/documentParser';

/**
 * list all calls under the project
 */
export const userCallList = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/calls');
        const { user } = res.locals;
        // const { projectId } = req.payload.params;

        const result = await userCallService.list(user);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * list all calls under the project
 */
export const userCallListUnderProject = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/:projectId/calls'
        );
        const { user } = res.locals;
        const { projectId } = req.payload.params;

        const result = await userCallService.listUnderProject(projectId, user);
        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * create new call under project
 */
export const userCreateCall = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects/:id/calls');
        consoleLog.log('req.body:', req.payload.body);
        const { user } = res.locals;
        const { body, params } = req.payload;

        consoleLog.log('user:', user);

        const input = {
            ...body,
            createdBy: user?._id,
            company: user?.company?._id,
            project: toMongoId(params.id),
        };

        // Process uploaded files
        if (req.files) {
            const documents = [];
            for (const file of req.files as Express.Multer.File[]) {
                const { content, parsed_at } =
                    await DocumentParser.parseDocument(file);
                documents.push({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    content,
                    parsed_at,
                });
            }

            if (documents.length > 0) {
                input.documents = documents;
            }
        }

        consoleLog.log('\n\n\ninput:', input);
        // const result = await userProjectService.createProject(input);
        const result = await userCallService.createCall(input);

        res.success(StatusCodes.CREATED, result);
    }
); // END

/**
 * get call by id
 */
export const userGetCallById = asyncHandler(
    async (req: Request<{}, { callId: string }, {}>, res: Response) => {
        consoleLog.log('Received a request at /users/calls/:callId');
        const { user } = res.locals;
        const { callId } = req.payload.params;

        const call = await userCallService.getCallById(callId, user);

        if (!call) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Call not found',
            });
        }

        // consoleLog.log('\n\n\n Call info: ', call);

        // const aiService = new AIService();
        // const result = await aiService.generateCallQuestions(call);

        res.success(StatusCodes.OK, call);
    }
); // end

/**
 * update call by id
 */
export const userUpdateCallById = asyncHandler(
    async (req: Request<{}, { callId: string }, {}>, res: Response) => {
        consoleLog.log('Received a request at /users/calls/:callId');
        const { user } = res.locals;
        const { body } = req.payload;
        const { callId } = req.payload.params;

        const input = {
            ...body,
        };

        // Process uploaded files
        if (req.files) {
            const documents = [];
            for (const file of req.files as Express.Multer.File[]) {
                const { content, parsed_at } =
                    await DocumentParser.parseDocument(file);
                documents.push({
                    filename: file.filename,
                    originalname: file.originalname,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size,
                    content,
                    parsed_at,
                });
            }

            if (documents.length > 0) {
                input.documents = documents;
            }
        }

        //res.success(200, input);

        const result = await userCallService.update(
            // projectId,
            callId,
            user,
            input
        );

        res.success(StatusCodes.OK, result);
    }
);
// end

/**
 * delete call by id
 */
export const userDeleteCall = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/:projectId/calls/:callId'
        );
        const { user } = res.locals;
        // return consoleLog.log('user:', user);
        const { projectId, callId } = req.payload.params;
        const result = await userCallService.delete(projectId, callId, user);
        res.success(StatusCodes.CREATED, result);
    }
); // END

/**
 * Public Projects
 */

/**
 * list all public calls
 */
export const listPublicCalls = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /projects/calls');
        const result = await userCallService.listPublicCalls();
        res.success(StatusCodes.OK, result);
    }
); // END
