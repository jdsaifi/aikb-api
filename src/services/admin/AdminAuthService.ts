import { StatusCodes } from 'http-status-codes';
import { AdminModel } from '../../models';
import { ApiError } from '../../utils/responseHandler';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IAdmin } from '../../models/Admin';

class AdminAuthService {
    /**
     * Create a new admin (restricted access)
     */
    async createAdmin(data: Partial<IAdmin>): Promise<IAdmin> {
        const existing = await AdminModel.findOne({ email: data.email });
        if (existing) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Admin username already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);
        const newAdmin = new AdminModel({
            ...data,
            password: hashedPassword,
        });

        return await newAdmin.save();
    } // END

    /**
     * Admin login
     */
    async login(email: string, password: string): Promise<{ token: string }> {
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Admin not found',
            });
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Invalid email or password',
            });
        }
        const token = jwt.sign({ sub: admin._id }, config.jwtSecret, {
            expiresIn: '100Days',
        });
        return { token };
    } // END
}
export default AdminAuthService;
