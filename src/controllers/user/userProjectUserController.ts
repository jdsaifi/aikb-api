import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { consoleLog } from '../../utils/consoleLog';
import asyncHandler from '../../utils/asyncHandler';
import { userProjectService } from '../../services/user';

// all users in a project
export const userProjectUserList = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/${projectId}/users'
        );
        const { user } = res.locals;
        const { projectId } = req.payload.params;
        const result = await userProjectService.listUsersInProject(
            user,
            projectId
        );
        res.success(StatusCodes.OK, result);
    }
);

export const userProjectUserAssign = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/${projectId}/users'
        );
        const { user } = res.locals;
        const { projectId } = req.payload.params;
        const { userId } = req.payload.body;
        const result = await userProjectService.assignProject(
            user,
            projectId,
            userId
        );
        res.success(StatusCodes.OK, result);
    }
);

export const userProjectUserUnassign = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/${projectId}/users/${userId}'
        );
        const { user } = res.locals;
        const { projectId, userId } = req.payload.params;
        const result = await userProjectService.unassignProject(
            user,
            projectId,
            userId
        );
        res.success(StatusCodes.OK, result);
    }
);

/** assign calls to project */
export const userAssignCallsToProject = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/:projectId/calls'
        );
        const { user } = res.locals;
        const { projectId } = req.payload.params;
        const { callIds } = req.payload.body;
        const result = await userProjectService.assignCalls(
            user,
            projectId,
            callIds
        );
        res.success(StatusCodes.CREATED, result);
    }
);

/** unassign calls from project */
export const userUnassignCallsFromProject = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log(
            'Received a request at /users/projects/:projectId/calls/:callId'
        );
        const { user } = res.locals;
        const { projectId, callId } = req.payload.params;
        console.log('req.payload.params: ', req.payload.params);
        const result = await userProjectService.unassignCalls(
            user,
            projectId,
            callId
        );
        res.success(StatusCodes.CREATED, result);
    }
);

/** get public projects */
export const listPublicProjects = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /projects/public');
        const result = await userProjectService.listPublicProjects();
        res.success(StatusCodes.OK, result);
    }
); // end
