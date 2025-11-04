import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import validateRequest from '../../middleware/validateRequest';

import { checkPermission } from '../../middleware/checkPermission';
import {
    userAllUserGroups,
    userCreateUserGroup,
    userDeleteUserGroup,
    userGetUserGroupById,
    userUpdateUserGroup,
} from '../../controllers/user/userGroupController';
import {
    createUserGroupSchema,
    deleteUserGroupSchema,
    getUserGroupByIdSchema,
    updateUserGroupSchema,
} from '../../validations/schema';

const router = Router();

// all user groups
router.get(
    '/v1/user-groups',
    [authorizeUserRequest, checkPermission('user-groups', 'view')],
    userAllUserGroups
); // END

// create user group

router.post(
    '/v1/user-groups',
    [
        authorizeUserRequest,
        checkPermission('user-groups', 'create'),
        validateRequest(createUserGroupSchema),
    ],
    userCreateUserGroup
); // END

// get user group by id
router.get(
    '/v1/users/user-groups/:id',
    [
        authorizeUserRequest,
        checkPermission('user-groups', 'view'),
        validateRequest(getUserGroupByIdSchema),
    ],
    userGetUserGroupById
); // END

// update user group
router.put(
    '/v1/users/user-groups/:id',
    [
        authorizeUserRequest,
        checkPermission('user-groups', 'update'),
        validateRequest(updateUserGroupSchema),
    ],
    userUpdateUserGroup
); // END

// delete user group
router.delete(
    '/v1/users/user-groups/:id',
    [
        authorizeUserRequest,
        checkPermission('user-groups', 'delete'),
        validateRequest(deleteUserGroupSchema),
    ],
    userDeleteUserGroup
); // END

export default router;
