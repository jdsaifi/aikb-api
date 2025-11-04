import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import { userCreateProject } from '../../controllers/user/userProjectController';
import validateRequest from '../../middleware/validateRequest';
import {
    callListSchema,
    createCallSchema,
    deleteCallSchema,
    getCallByIdSchema,
    updateCallSchema,
} from '../../validations/schema';
import { checkPermission } from '../../middleware/checkPermission';
import {
    listPublicCalls,
    userCallList,
    userCallListUnderProject,
    userCreateCall,
    userDeleteCall,
    userGetCallById,
    userUpdateCallById,
} from '../../controllers/user/userCallController';
import { upload } from '../../middleware/fileUpload';

const router = Router();

// list all calls
router.get(
    '/v1/users/calls',
    [
        authorizeUserRequest,
        // checkPermission('projects', 'view'),
        checkPermission('calls', 'view'),
        // validateRequest(callListSchema),
    ],
    userCallList
); // END

// list all calls under the project
router.get(
    '/v1/users/projects/:projectId/calls',
    [
        authorizeUserRequest,
        checkPermission('projects', 'view'),
        checkPermission('calls', 'view'),
        validateRequest(callListSchema),
    ],
    userCallListUnderProject
); // END

// create call
router.post(
    '/v1/users/projects/:id/calls',
    [
        authorizeUserRequest,
        checkPermission('projects', 'create'),
        checkPermission('calls', 'create'),
        upload.array('documents', 5),
        validateRequest(createCallSchema),
    ],
    userCreateCall
); // END

// get call by id
router.get(
    '/v1/users/calls/:callId',
    [
        authorizeUserRequest,
        // checkPermission('projects', 'view'),
        checkPermission('calls', 'view'),
        validateRequest(getCallByIdSchema),
    ],
    userGetCallById
); // END

// update call by id
router.put(
    '/v1/users/calls/:callId',
    [
        authorizeUserRequest,
        // checkPermission('projects', 'update'),
        checkPermission('calls', 'update'),
        upload.array('documents', 5),
        validateRequest(updateCallSchema),
    ],
    userUpdateCallById
); // END

// delete call by id
router.delete(
    '/v1/users/projects/:projectId/calls/:callId',
    [
        authorizeUserRequest,
        checkPermission('projects', 'delete'),
        checkPermission('calls', 'delete'),
        validateRequest(deleteCallSchema),
    ],
    userDeleteCall
); // END

/**
 * Public Projects
 */

// list all public projects
router.get('/v1/calls/public', listPublicCalls); // END

export default router;
