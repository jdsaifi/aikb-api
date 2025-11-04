import { Router } from 'express';
import { authorizeUserRequest } from '../../middleware/userAuth';
import { userProfile } from '../../controllers/user/userAuthController';

const router = Router();

// user profile route
router.get('/v1/users/profile', authorizeUserRequest, userProfile);

export default router;
