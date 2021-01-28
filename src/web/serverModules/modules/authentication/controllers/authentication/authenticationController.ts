import getTokenSet from './getTokenSet/getTokenSet';
import refreshTokenSet from './refreshTokenSet/refreshTokenSet';
import { AuthenticationController } from './authenticationController.types';
import { ControllerFactory } from 'web/serverModules/types';

const authenticationController: ControllerFactory<AuthenticationController> = ({ authenticationService }) => ({
  token: getTokenSet(authenticationService),
  refreshToken: refreshTokenSet(authenticationService)
});

export default authenticationController;
