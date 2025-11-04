import { Router } from 'express';

import AuthRoutes from './auth';
import ProfileRoutes from './profile';
import ProjectRoutes from './project';
import CallRoutes from './call';
import FeedbackRoutes from './feedback';
import UserGroupRoutes from './userGroup';
import UserRoutes from './user';
import DocumentRoutes from './document';
import KBRoutes from './kb';
import TagMasterRoutes from './tagmaster';

const router = Router();

router.use([
    AuthRoutes,
    ProfileRoutes,
    ProjectRoutes,
    CallRoutes,
    FeedbackRoutes,
    UserGroupRoutes,
    UserRoutes,
    DocumentRoutes,
    KBRoutes,
    TagMasterRoutes,
]);

export default router;
