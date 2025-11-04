import { Router } from 'express';
import { authorizeAdminRequest } from '../../middleware/adminAuth';
import validateRequest from '../../middleware/validateRequest';
import { addModuleSchema, moduleSchema } from '../../validations/schema';
import { createModule } from '../../controllers/admin/adminModuleController';

const router = Router();

// add new module
router.post(
    '/v1/admins/modules',
    [authorizeAdminRequest, validateRequest(addModuleSchema)],
    createModule
); // end

export default router;
