import { Fcn } from 'common/types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

import pluginSdkServiceUnbound from './serviceFactory.unbound';
import { AuthenticationService } from '../http/authentication/types';
import { UserService } from '../sequelize/userService/userService.types';
import { PluginSdkService } from './serviceFactory.types';

describe(`service`, () => {
  describe(`pluginSdkService module`, () => {
    let authenticationServiceFactory: Fcn<[ISSOConfig], AuthenticationService> = () => ({} as AuthenticationService);
    let userServiceFactory: Fcn<null, UserService> = () => ({} as UserService);
    let pluginSdkService: PluginSdkService;

    beforeAll(() => {
      pluginSdkService = pluginSdkServiceUnbound
        .apply(null, [authenticationServiceFactory, userServiceFactory])
        .apply(null, [{}])
        .apply(null, [{}]);
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(`Should return 'PluginSdkService'`, () => {
      expect(pluginSdkService).toBeObject;

      expect(pluginSdkService).toHaveProperty('sdkStartStop');
      expect(pluginSdkService).toHaveProperty('sdkTransaction');
      expect(pluginSdkService).toHaveProperty('authenticationService');
      expect(pluginSdkService).toHaveProperty('userService');
    });
  });
});
