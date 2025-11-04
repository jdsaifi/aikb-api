import { Router } from 'express';
import {
    userLogin,
    userLoginWithGoogle,
} from '../../controllers/user/userAuthController';
import validateRequest from '../../middleware/validateRequest';
import {
    loginSchemaWithBody,
    loginWithGoogleSchema,
} from '../../validations/schema';

const router = Router();

// login route
router.post('/v1/auth/login', validateRequest(loginSchemaWithBody), userLogin);

// login with google
router.post(
    '/v1/auth/google-login',
    validateRequest(loginWithGoogleSchema),
    userLoginWithGoogle
);

export default router;
