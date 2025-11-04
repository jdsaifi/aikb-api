import { Router } from 'express';
import { authorizeAdminRequest } from '../../middleware/adminAuth';
import { adminListAllUsers } from '../../controllers/admin/adminUserController';

const router = Router();

// list all users
router.get('/v1/admins/users', authorizeAdminRequest, adminListAllUsers);

export default router;
