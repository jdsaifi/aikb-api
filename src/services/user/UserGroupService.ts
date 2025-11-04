import { UserGroupModel } from '../../models';
import { IUser, IUserGroup } from '../../types';
class UserGroupService {
    async allUserGroups(user: IUser) {
        // Implementation to fetch all user groups
        const userGroups = await UserGroupModel.find({
            company: user.company,
            deletedAt: null,
        })
            .populate('permissions.module', 'name displayName')
            .sort({ createdAt: -1 });
        return userGroups;
    }

    async getUserGroupById(user: IUser, userGroupId: string) {
        // Implementation to fetch user group by ID
        const userGroup = await UserGroupModel.findOne({
            _id: userGroupId,
            company: user.company,
            deletedAt: null,
        }).populate('permissions.module', 'name displayName');
        return userGroup;
    }

    async createUserGroup(data: IUserGroup) {
        // Implementation to create a new user group
        const userGroup = await UserGroupModel.create(data);
        return userGroup;
    }

    async updateUserGroup(user: IUser, userGroupId: string, data: any) {
        // Implementation to update an existing user group
        const userGroup = await UserGroupModel.findOneAndUpdate(
            { _id: userGroupId, company: user.company?._id },
            data,
            { new: true }
        ).populate('permissions.module', 'name displayName');
        return userGroup;
    }

    async deleteUserGroup(user: IUser, userGroupId: string) {
        // Implementation to delete a user group
        const userGroup = await UserGroupModel.findOneAndUpdate(
            { _id: userGroupId, company: user.company?._id },
            { deletedAt: new Date(), deletedBy: user._id },
            { new: true }
        );
        return userGroup;
    }
}
export default UserGroupService;
