import { ControllerFactory } from 'web/serverModules/types';
import { AuthenticationController } from './authentication/authenticationController.types'

export interface AuthenticationModuleControllers {
  authenticationController: ControllerFactory<AuthenticationController>;
}
