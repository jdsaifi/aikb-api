import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import {
    getUserProjectById,
    userCreateProject,
    userDeleteProjectById,
    userListProjects,
    userUpdateProject,
} from '../../controllers/user/userProjectController';
import validateRequest from '../../middleware/validateRequest';
import {
    assignCallsToProjectSchema,
    assignProjectToUserSchema,
    createProjectSchema,
    deleteUserProjectSchema,
    listUsersInProjectSchema,
    unassignCallsFromProjectSchema,
    unassignProjectFromUserSchema,
    updateUserProjectSchema,
} from '../../validations/schema';
import { checkPermission } from '../../middleware/checkPermission';
import {
    userProjectUserAssign,
    userProjectUserList,
    userProjectUserUnassign,
    listPublicProjects,
    userAssignCallsToProject,
    userUnassignCallsFromProject,
} from '../../controllers/user/userProjectUserController';

const router = Router();

// create project
router.post(
    '/v1/users/projects',
    [
        authorizeUserRequest,
        checkPermission('projects', 'create'),
        validateRequest(createProjectSchema),
    ],
    userCreateProject
); // END

// list all projects of user
router.get(
    '/v1/users/projects',
    [authorizeUserRequest, checkPermission('projects', 'view')],
    userListProjects
); // END

// get project by id
router.get(
    '/v1/users/projects/:id',
    authorizeUserRequest,
    checkPermission('projects', 'view'),
    getUserProjectById
); // END

// update project by id
router.put(
    '/v1/users/projects/:id',
    [
        authorizeUserRequest,
        checkPermission('projects', 'update'),
        validateRequest(updateUserProjectSchema),
    ],
    userUpdateProject
); // END

// delete project by id
router.delete(
    '/v1/users/projects/:id',
    [
        authorizeUserRequest,
        checkPermission('projects', 'delete'),
        validateRequest(deleteUserProjectSchema),
    ],
    userDeleteProjectById
); // END

// list users in a project
router.get(
    '/v1/users/projects/:projectId/users',
    [
        authorizeUserRequest,
        checkPermission('projects', 'view'),
        validateRequest(listUsersInProjectSchema),
    ],
    userProjectUserList
); // END

// assign project to user
router.post(
    '/v1/users/projects/:projectId/users',
    [
        authorizeUserRequest,
        checkPermission('projects', 'update'),
        validateRequest(assignProjectToUserSchema),
    ],
    userProjectUserAssign
); // END

// unassign project from user
router.delete(
    '/v1/users/projects/:projectId/users/:userId',
    [
        authorizeUserRequest,
        checkPermission('projects', 'update'),
        validateRequest(unassignProjectFromUserSchema),
    ],
    userProjectUserUnassign
); // END

// assign calls to project
router.post(
    '/v1/users/projects/:projectId/calls',
    [
        authorizeUserRequest,
        checkPermission('projects', 'update'),
        validateRequest(assignCallsToProjectSchema),
    ],
    userAssignCallsToProject
); // END

// unassign calls from project
router.delete(
    '/v1/users/projects/:projectId/calls/:callId',
    [
        authorizeUserRequest,
        checkPermission('projects', 'update'),
        validateRequest(unassignCallsFromProjectSchema),
    ],
    userUnassignCallsFromProject
); // END

/**
 * Public Projects
 */

// list all public projects
router.get('/v1/projects/public', listPublicProjects); // END

export default router;
