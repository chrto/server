import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { Fcn } from 'common/types';

import sdkStartStopFactory from './sdkStartStop/sdkStartStop';
import sdkTransactionFactory from './sdkTransaction/sdkTransaction';
import { UserService } from '../sequelize/userService/userService.types';
import { PluginSdkService } from './serviceFactory.types';
import { AuthenticationService } from '../http/authentication/types';

export default (
  authenticationServiceFactory: Fcn<[ISSOConfig], AuthenticationService>,
  userServiceFactory: Fcn<[], UserService>) =>
  (appConfig: AppConfig) =>
    (sdkSequelize: PluginSdkSequelize): PluginSdkService => ({
      sdkStartStop: sdkStartStopFactory(sdkSequelize),
      sdkTransaction: sdkTransactionFactory(sdkSequelize),

      authenticationService: authenticationServiceFactory(appConfig.sso),
      userService: userServiceFactory()
    });
