import { Router } from 'express';
import { authorizeAdminRequest } from '../../middleware/adminAuth';
import validateRequest from '../../middleware/validateRequest';

import {
    adminAddCompany,
    adminListCompanies,
} from '../../controllers/admin/adminCompanyController';
import { addCompanySchema } from '../../validations/schema';

const router = Router();

// add new company
router.post(
    '/v1/admins/companies',
    [authorizeAdminRequest, validateRequest(addCompanySchema)],
    adminAddCompany
);

// list companies
router.get('/v1/admins/companies', authorizeAdminRequest, adminListCompanies);

export default router;
