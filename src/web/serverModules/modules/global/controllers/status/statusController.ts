import getStatus from './getStatus/getStatus';
import { ControllerFactory } from 'web/serverModules/types';
import { StatusController } from './statusController.types';

const statusController: ControllerFactory<StatusController> = ({ authenticationService, sdkStartStop }) => ({
  getStatus: getStatus(authenticationService, sdkStartStop)
});

export default statusController;
