import registerModuleUnbound from './registerModule.unbound';
import { Router, Express } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { ServerFactoryParams } from 'web/server/factory/params/factoryParams.types';
import { ModuleMapping } from '../registerModules.types';

const MODULE_NAME: string = 'module';
const APP_CONFIG: AppConfig = {
  server: {}
} as AppConfig;

const SERVICE: PluginSdkService = {
  userService: null,
  authenticationService: null
} as PluginSdkService;

const ROUTER: Router = {
  get: null
} as Router;

describe('Register server modules', () => {
  describe('Register module', () => {
    let logger: any = {};
    let expressApp: Express = {} as Express;
    let serverFactoryParams: ServerFactoryParams = {
      appConfig: APP_CONFIG,
      service: SERVICE
    } as ServerFactoryParams;

    let moduleMapping: ModuleMapping = {
      [MODULE_NAME]: {
        routerPath: 'api/v1/module',
        routerConfigurator: null
      }
    };

    beforeAll(() => {
      logger.debug = jest.fn().mockReturnThis();
      expressApp.use = jest.fn().mockReturnThis();
      serverFactoryParams.expressApp = expressApp;
      moduleMapping.module.routerConfigurator = jest.fn().mockReturnValue(ROUTER);

      registerModuleUnbound
        .apply(null, [logger])
        .apply(null, [serverFactoryParams, moduleMapping])
        .apply(null, [MODULE_NAME]);
    });

    it(`Should be able obtain module configuration by module name`, () => {
      expect(moduleMapping[MODULE_NAME]).toHaveProperty('routerConfigurator');
      expect(moduleMapping[MODULE_NAME]).toHaveProperty('routerPath');
    });

    it(`Should log exact message`, () => {
      expect(logger.debug).toHaveBeenCalledTimes(1);
      expect(logger.debug).toHaveBeenCalledWith(`registering module ${MODULE_NAME} on '${moduleMapping[MODULE_NAME].routerPath}'`);
    });

    it(`Should register exact module, after debug message has been logged`, () => {
      expect(expressApp.use)        .toHaveBeenCalledTimes(1);
      expect(expressApp.use).toHaveBeenCalledWith(moduleMapping[MODULE_NAME].routerPath, ROUTER);
      // expect(expressApp.use).toHaveBeenCalledAfter(logger.debug)  TODO: fix this
    });
  });
});
