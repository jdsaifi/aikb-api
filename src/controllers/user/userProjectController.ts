import { Request, Response } from 'express';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { StatusCodes } from 'http-status-codes';
import { userProjectService } from '../../services/user';
import { ApiError } from '../../utils/responseHandler';

/**
 * create new project
 */
export const userCreateProject = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects');
        consoleLog.log('req.body:', req.payload.body);
        const { user } = res.locals;
        const { body } = req.payload;

        consoleLog.log('user:', user);

        const input = {
            ...body,
            createdBy: user?._id,
            company: user?.company?._id,
        };
        const result = await userProjectService.createProject(input);

        res.success(StatusCodes.CREATED, result);
    }
); // END

/**
 * get all projects of user
 */
export const userListProjects = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects');
        const { user } = res.locals;

        consoleLog.log('user:', user);
        const result = await userProjectService.listProjects(user);

        res.success(StatusCodes.OK, result);
    }
); // END

/**
 * get project by id
 */
export const getUserProjectById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects/:id');
        const { user } = res.locals;
        const projectId = req.params.id;
        // throw new ApiError({
        //     httpCode: StatusCodes.NOT_FOUND,
        //     description: 'Project not found',
        // });

        const result = await userProjectService.getProjectById(projectId, user);
        res.success(StatusCodes.OK, result);
    }
); // END

/**
 * delete project by id
 */
export const userDeleteProjectById = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects/:id');
        const { user } = res.locals;
        const projectId = req.params.id;
        const result = await userProjectService.deleteProject(user, projectId);
        res.success(StatusCodes.CREATED, result);
    }
); // END

/**
 * update project by id
 */
export const userUpdateProject = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /users/projects/:id');
        const { user } = res.locals;
        const projectId = req.params.id;
        const { body } = req.payload;
        const result = await userProjectService.updateProject(
            user,
            projectId,
            body
        );
        res.success(StatusCodes.CREATED, result);
    }
); // END
