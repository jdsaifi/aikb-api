import { CompanyModel } from '../../models/Company';
import { UserModel } from '../../models/User';
import { ICompany, IUser } from '../../types';
import { hashPassword } from '../../utils/helpers';

class AdminCompanyService {
    /**
     * Create a new company
     */
    async createCompany(data: {
        companyName: string;
        userFullName: string;
        email: string;
        password: string;
    }): Promise<{
        company: ICompany;
        companyAdmin: Omit<IUser, '__v' | 'password'>;
    }> {
        const session = await CompanyModel.startSession();
        session.startTransaction();

        try {
            const company = await CompanyModel.create(
                [{ name: data.companyName }],
                {
                    session,
                }
            );

            const hashedPassword = await hashPassword(data.password);

            const companyAdmin = await UserModel.create(
                [
                    {
                        name: data.userFullName,
                        email: data.email,
                        role: 'admin',
                        password: hashedPassword,
                        company: company[0]._id,
                    },
                ],
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return {
                company: company[0],
                companyAdmin: companyAdmin[0],
            };
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    } // END

    /**
     * List all companies
     */
    async listCompanies() {
        const companies = await CompanyModel.find({});
        return companies;
    }
}
export default AdminCompanyService;
