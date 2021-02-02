import { AsyncStartStop, SdkTransaction } from 'model/sequelize/modelFactory/modelFactory.types';

import { AuthenticationService } from '../http/authentication/types';
import { UserService } from '../sequelize/userService/userService.types';

export interface PluginSdkService {
  sdkStartStop: AsyncStartStop;
  sdkTransaction: SdkTransaction;
  authenticationService: AuthenticationService;
  userService: UserService;
}
