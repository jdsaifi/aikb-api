import { Router } from 'express';
import { insertAllTags } from '../controllers/tagController';

const router = Router();

router.post('/v1/tag-master', insertAllTags);

export default router;
