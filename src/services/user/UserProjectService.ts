import { StatusCodes } from 'http-status-codes';
import { CallModel, ProjectModel, UserModel } from '../../models';
import { IProjects, IUser } from '../../types';
import { ApiError } from '../../utils/responseHandler';
import { ProjectInput } from '../../validations/schema';

class UserProjectService {
    constructor() {}

    /** create project */
    async createProject(input: Partial<ProjectInput>): Promise<IProjects> {
        const newProject = await ProjectModel.create(input);
        return newProject;
    } // END

    /** get all projects */
    async listProjects(user: IUser) {
        let condition: any = {
            $and: [
                { deletedAt: null },
                { $or: [{ createdBy: user._id }, { members: user._id }] },
            ],
        };

        if (user.role === 'admin') {
            condition = {
                company: user.company,
                deletedAt: null,
            };
        }

        const projects = await ProjectModel.find(condition)
            .select('-__v -members')
            .populate('company', 'name')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        return projects;
    } // END

    /** get project by id */
    async getProjectById(id: string, user: IUser): Promise<IProjects | null> {
        let condition: any = {
            _id: id,
            $and: [
                { deletedAt: null },
                { $or: [{ createdBy: user._id }, { members: user._id }] },
            ],
        };

        if (user.role === 'admin') {
            condition = {
                _id: id,
                deletedAt: null,
            };
        }

        const project = await ProjectModel.findOne(condition)
            .select('-__v -members')
            .populate('company', 'name')
            .populate('createdBy', 'name email');
        return project;
    } // END

    /** list users in a project */
    async listUsersInProject(user: IUser, projectId: string) {
        let condition: any = {
            _id: projectId,
            $and: [
                { deletedAt: null },
                { $or: [{ createdBy: user._id }, { members: user._id }] },
            ],
        };

        if (user.role === 'admin') {
            condition = {
                _id: projectId,
                deletedAt: null,
            };
        }

        const project = await ProjectModel.findOne(condition);
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        const users = await UserModel.find({
            _id: { $in: project.members },
            company: project.company,
            role: 'user',
            isActive: true,
        })
            .select('-__v -password')
            .populate('userGroup', 'name displayName')
            .sort({ createdAt: -1 });
        return users;
    } // END

    /** assign project */
    async assignProject(user: IUser, projectId: string, userId: string) {
        const userInfo = await UserModel.findOne({
            _id: userId,
            company: user.company,
            role: 'user',
            isActive: true,
        });
        if (!userInfo) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not found',
            });
        }
        // check if user is already in the project
        const project = await ProjectModel.findOne({
            _id: projectId,
            members: userId,
            deletedAt: null,
        });
        if (project) {
            return project;
        }
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: projectId, createdBy: user._id },
            { $push: { members: userId } },
            { new: true }
        );
        if (!updatedProject) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        return updatedProject;
    } // END

    /** unassign project */
    async unassignProject(user: IUser, projectId: string, userId: string) {
        const userInfo = await UserModel.findOne({
            _id: userId,
            company: user.company,
            role: 'user',
            isActive: true,
        });
        if (!userInfo) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not found',
            });
        }
        // check if user is already in the project
        const project = await ProjectModel.findOne({
            _id: projectId,
            members: userId,
            deletedAt: null,
        });
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'User not in the project',
            });
        }
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: projectId, createdBy: user._id },
            { $pull: { members: userId } },
            { new: true }
        );
        if (!updatedProject) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        return updatedProject;
    } // END

    /** assign calls */
    async assignCalls(user: IUser, projectId: string, callIds: string[]) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            deletedAt: null,
        });
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        // check if calls are already in the project
        const calls = await CallModel.find({
            _id: { $in: callIds },
            deletedAt: null,
        });
        // if (calls.length !== callIds.length) {
        //     throw new ApiError({
        //         httpCode: StatusCodes.NOT_FOUND,
        //         description: 'Calls not found',
        //     });
        // }
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: project._id, company: user.company },
            { $set: { calls } },
            { new: true }
        );

        return updatedProject;
    } // END

    /** unassign calls */
    async unassignCalls(user: IUser, projectId: string, callId: string) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            deletedAt: null,
        });
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }

        // unassign calls from project
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: project._id, company: user.company },
            { $pull: { calls: callId } },
            { new: true }
        );

        return updatedProject;
    } // END

    /** delete project */
    async deleteProject(user: IUser, projectId: string) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            company: user.company,
            deletedAt: null,
        });
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: project._id },
            { deletedAt: new Date(), deletedBy: user._id },
            { new: true }
        );
        return updatedProject;
    } // END

    /** update project */
    async updateProject(
        user: IUser,
        projectId: string,
        body: Partial<ProjectInput>
    ) {
        const project = await ProjectModel.findOne({
            _id: projectId,
            company: user.company,
            deletedAt: null,
        });
        if (!project) {
            throw new ApiError({
                httpCode: StatusCodes.NOT_FOUND,
                description: 'Project not found',
            });
        }
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { _id: project._id },
            { ...body, updatedAt: new Date() },
            { new: true }
        );
        return updatedProject;
    } // END

    /** list public projects */
    async listPublicProjects() {
        const projects = await ProjectModel.find({
            isPublic: true,
            deletedAt: null,
        })
            .select(' -members -deletedAt -deletedBy')
            .populate('company', 'name')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        return projects;
    } // END
}

export default UserProjectService;
