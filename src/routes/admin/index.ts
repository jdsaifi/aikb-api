import { Router } from 'express';

import ModuleRoutes from './module';
import AuthRoutes from './auth';
import CompanyRoutes from './company';
import AdminDocumentRoutes from './document';
import AdminUserRoutes from './user';

const router = Router();

router.use([
    AuthRoutes,
    ModuleRoutes,
    CompanyRoutes,
    AdminDocumentRoutes,
    AdminUserRoutes,
]);

router.get('/v1/admins', (req, res) => {
    console.log('Received a request at /admin');
    res.send('Welcome to the Admin Dashboard!');
});

export default router;
