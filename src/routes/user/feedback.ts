import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import { userCreateProject } from '../../controllers/user/userProjectController';
import validateRequest from '../../middleware/validateRequest';
import {
    callListSchema,
    createFeedbackSchema,
    updateFeedbackTranscript,
} from '../../validations/schema';
import { checkPermission } from '../../middleware/checkPermission';

import {
    userGetFeedback,
    userUpdateFeedbackTranscript,
} from '../../controllers/user/userFeedbackController';

const router = Router();

// get feedback record for the user
router.post(
    '/v1/users/projects/:projectId/calls/:callId/feedbacks',
    [
        authorizeUserRequest,
        checkPermission('projects', 'view'),
        checkPermission('calls', 'view'),
        validateRequest(createFeedbackSchema),
    ],
    userGetFeedback
); // END

// update feedback transacript
router.put(
    '/v1/users/projects/:projectId/calls/:callId/feedbacks/:feedbackId/transcript',
    [
        authorizeUserRequest,
        checkPermission('projects', 'view'),
        checkPermission('calls', 'view'),
        validateRequest(updateFeedbackTranscript),
    ],
    userUpdateFeedbackTranscript
);

// // create call
// router.post(
//     '/v1/users/projects/:id/calls',
//     [
//         authorizeUserRequest,
//         checkPermission('projects', 'create'),
//         checkPermission('calls', 'create'),
//         validateRequest(createCallSchema),
//     ],
//     userCreateCall
// ); // END

// // get call by id
// router.get(
//     '/v1/users/projects/:projectId/calls/:callId',
//     [
//         authorizeUserRequest,
//         checkPermission('projects', 'view'),
//         checkPermission('calls', 'view'),
//         validateRequest(getCallByIdSchema),
//     ],
//     userGetCallById
// ); // END

// // update call by id
// router.put(
//     '/v1/users/projects/:projectId/calls/:callId',
//     [
//         authorizeUserRequest,
//         checkPermission('projects', 'update'),
//         checkPermission('calls', 'update'),
//         validateRequest(updateCallSchema),
//     ],
//     userUpdateCallById
// ); // END

export default router;
