import registerModulesUnbound from './registerModules.unbound';

import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from '../configuration/loader/appConfig.types';
import { ServerFactoryParams } from '../factory/params/factoryParams.types';
import { ModuleMapping } from './registerModules.types';

const MODULE_NAME: string = 'module';

const MODULE_MAPPING: ModuleMapping = {
  [`${MODULE_NAME}_1`]: {
    routerPath: `api/v1/${MODULE_NAME}_1`,
    routerConfigurator: null
  },
  [`${MODULE_NAME}_2`]: {
    routerPath: `api/v1/${MODULE_NAME}_2`,
    routerConfigurator: null
  }
};

const MODULE_NAMES: string[] = Object.keys(MODULE_MAPPING);

const APP_CONFIG: AppConfig = {
  server: {}
} as AppConfig;

const SERVICE: PluginSdkService = {
  userService: null,
  authenticationService: null
} as PluginSdkService;

const SERVER_FACTORY_PARAMS: ServerFactoryParams = {
  appConfig: APP_CONFIG,
  service: SERVICE,
  expressApp: {}
} as ServerFactoryParams;

describe('Register server modules', () => {
  describe('Register modules', () => {
    let forEachCB: jest.Mock<void, [string]>;
    let registerModule: jest.Mock<jest.Mock<void, [string]>, [ServerFactoryParams, ModuleMapping]>;

    beforeAll(() => {
      forEachCB = jest.fn().mockReturnValue(null);
      registerModule = jest.fn().mockReturnValue(forEachCB);

      registerModulesUnbound
        .apply(null, [registerModule])
        .apply(null, [MODULE_MAPPING])
        .apply(null, [SERVER_FACTORY_PARAMS]);
    });

    it(`Should create callback function for 'forEach', and inject exact parameter in to callback closure`, () => {
      expect(registerModule)
        .toHaveBeenCalledTimes(1);
      expect(registerModule)
        .toHaveBeenCalledWith(SERVER_FACTORY_PARAMS, MODULE_MAPPING);
    });

    it(`Should register modules, which has been defined in 'ModuleMapping' configuration`, () => {
      expect(forEachCB)
        .toHaveBeenCalledTimes(2);
      expect(forEachCB)
        .toHaveBeenNthCalledWith(1, MODULE_NAMES[0], 0, MODULE_NAMES);
      expect(forEachCB)
        .toHaveBeenNthCalledWith(2, MODULE_NAMES[1], 1, MODULE_NAMES);
    });
  });
});
