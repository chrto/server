import { ControllerFactory } from 'web/serverModules/types';
import { CurrentUserController } from './currentUser/currentUserController.types';
import { UserController } from './user/userController.types';

export interface PortalModuleControllers {
  currentUserController: ControllerFactory<CurrentUserController>;
  userController: ControllerFactory<UserController>;
}
