import { ControllerFactory } from 'web/serverModules/types';
import { StatusController } from './status/statusController.types';

export interface GlobalModuleControllers {
  statusController: ControllerFactory<StatusController>;
}
