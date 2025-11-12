import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import { userMe, userProfile } from '../../controllers/user/userAuthController';

const router = Router();

// me
router.get('/v1/users/me', authorizeUserRequest, userMe);

// user profile route
router.get('/v1/users/profile', authorizeUserRequest, userProfile);

export default router;
