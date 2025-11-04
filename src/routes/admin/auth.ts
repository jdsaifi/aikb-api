import { Router } from 'express';
import { authorizeAdminRequest } from '../../middleware/adminAuth';

import {
    addAdmin,
    adminDashboard,
    adminLogin,
    adminLogout,
} from '../../controllers/admin/adminAuthController';

const router = Router();

// Admin login route
router.post('/v1/admins/login', adminLogin);
// Admin logout route
router.post('/v1/admins/logout', adminLogout);
// Admin dashboard route
router.get('/v1/admins/dashboard', authorizeAdminRequest, adminDashboard);

// add admin route
router.post('/v1/admins/add', addAdmin);

export default router;
