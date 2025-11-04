import { Router } from 'express';

import AdminRoutes from './admin';
import CompanyRoutes from './company';
import UserRoutes from './user';
import ModuleRoutes from './modules';
import TagRoutes from './tag';

const router = Router();

router.use([AdminRoutes, CompanyRoutes, UserRoutes, ModuleRoutes, TagRoutes]);

export default router;
