import { z } from 'zod';

/** * Admin add company validation */
export const adminAddCompanyValidation = z.object({
    body: z.object({
        companyName: z
            .string({
                message: 'Company name is required',
            })
            .min(1, 'Company name is required'),
        email: z.string().email('Invalid email format'),
        userFullName: z.string().min(1, 'User full name is required'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long'),
    }),
}); // END
