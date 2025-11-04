import { Router } from 'express';
import {
    getConversation,
    getConversations,
    queryKB,
} from '../../controllers/user/kbController';
import { authorizeUserRequest } from '../../middleware/userAuth';
// import { authorizeUserRequest } from '../../middleware/userAuth';
// import { userProfile } from '../../controllers/user/userAuthController';

const router = Router();

// get conversations
router.get('/v1/kbs/conversations', authorizeUserRequest, getConversations);

// get conversation
router.get(
    '/v1/kbs/conversations/:conversationId',
    authorizeUserRequest,
    getConversation
);

// user profile route
router.post('/v1/kbs/query', authorizeUserRequest, queryKB);

export default router;
