import UserAuthService from './UserAuthService';
import UserService from './UserService';
import UserProjectService from './UserProjectService';
import UserCallService from './UserCallService';
import UserFeedbackService from './UserFeedbackService';
import UserGroupService from './UserGroupService';
import DocumentService from './DocumentService';

export const userAuthService = new UserAuthService();
export const userService = new UserService();
export const userProjectService = new UserProjectService();
export const userCallService = new UserCallService();
export const userFeedbackService = new UserFeedbackService();
export const userGroupService = new UserGroupService();
export const documentService = new DocumentService();
