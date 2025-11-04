import { adminCompanyService } from '../../services/admin';
import asyncHandler from '../../utils/asyncHandler';
import { consoleLog } from '../../utils/consoleLog';
import { Request, Response } from 'express';

/** admin add company */
export const adminAddCompany = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /admins/companies');
        consoleLog.log('req.payload:', req.payload);
        const result = await adminCompanyService.createCompany(req.body);
        res.success(201, result);
    }
); // END

/** admin list companies */
export const adminListCompanies = asyncHandler(
    async (req: Request, res: Response) => {
        consoleLog.log('Received a request at /admins/companies');
        const result = await adminCompanyService.listCompanies();
        res.success(200, result);
    }
); // END
