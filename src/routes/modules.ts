import { Router } from 'express';
import { allModules } from '../controllers/modulesController';

const router = Router();

router.get('/v1/modules', allModules);

export default router;
