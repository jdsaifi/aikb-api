import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import validateRequest from '../../middleware/validateRequest';
import { checkPermission } from '../../middleware/checkPermission';

import { listAllTags } from '../../controllers/tagController';

const router = Router();

// list
router.get(
    '/v1/tag-masters',
    [authorizeUserRequest, checkPermission('tag-masters', 'view')],
    listAllTags
); // END

// get tag master by id
// router.get(
//     '/v1/tag-masters/:id',
//     [
//         authorizeUserRequest,
//         checkPermission('users', 'view'),
//         validateRequest(getUserByIdSchema),
//     ],
//     userGetUserById
// ); // END

// // add new user
// router.post(
//     '/v1/users',
//     [authorizeUserRequest, checkPermission('users', 'create')],
//     validateRequest(addUserSchema),
//     userAddUser
// ); // END

// // update user
// router.put(
//     '/v1/users/:id',
//     [authorizeUserRequest, checkPermission('users', 'update')],
//     validateRequest(updateUserSchema),
//     userUpdateUser
// ); // END

// // delete user
// router.delete(
//     '/v1/users/:id',
//     [
//         authorizeUserRequest,
//         checkPermission('users', 'delete'),
//         validateRequest(deleteUserSchema),
//     ],
//     userDeleteUser
// ); // END

export default router;
