import { PortalModuleControllers } from './controllers.types';
import currentUserController from './currentUser/currentUserController';
import userController from './user/userController';

const controllers: PortalModuleControllers = { currentUserController, userController };
export default controllers;
