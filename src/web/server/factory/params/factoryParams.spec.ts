import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import { ENodeENV } from 'web/server/configuration/loader/nodeEnv/nodeEnvConfig.types';
import { IServerConfig } from 'web/server/configuration/loader/server/serverConfig.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { Express } from 'express';
import { Fcn } from 'common/types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';

import factoryParamsUnbound from './factoryParams.unbound';
import { ServerFactoryParams } from './factoryParams.types';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';

const APP_CONFIG: AppConfig = {
  environment: ENodeENV.development,
  server: {} as IServerConfig,
  database: {} as IDatabaseConfig,
  sso: {} as ISSOConfig,
  appLogger: {} as ILoggerConfig
};

describe('server factory params module', () => {
  describe(`'factoryParams'`, () => {
    const expressApp: Express = {} as Express;
    const sdkSequelize: PluginSdkSequelize = {} as PluginSdkSequelize;
    const service: PluginSdkService = {} as PluginSdkService;

    let serviceFactory: jest.Mock<PluginSdkService, [PluginSdkSequelize]>;
    let serviceFactoryUnbound: jest.Mock<jest.Mock<PluginSdkService, [PluginSdkSequelize]>, [AppConfig]>;
    let createExpressApp: Fcn<null, Express>;
    let modelFactory: Fcn<[IDatabaseConfig], PluginSdkSequelize>;
    let factoryParams: Fcn<[AppConfig], ServerFactoryParams>;

    beforeAll(() => {
      createExpressApp = jest.fn().mockReturnValue(expressApp);
      modelFactory = jest.fn().mockReturnValue(sdkSequelize);
      serviceFactory = jest.fn().mockReturnValue(service);
      serviceFactoryUnbound = jest.fn().mockImplementation((_appConfig: AppConfig) => serviceFactory);

      factoryParams = factoryParamsUnbound
        .apply(null, [
          createExpressApp,
          serviceFactoryUnbound,
          modelFactory
        ]);
    });
    it(`Should return params for server factory`, () => {
      const expected: ServerFactoryParams = {
        service: service,
        expressApp: expressApp,
        appConfig: APP_CONFIG
      };
      expect(factoryParams(APP_CONFIG)).toBeObject;
      expect(factoryParams(APP_CONFIG)).toStrictEqual(expected);
    });
  });
});
