import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Express } from 'express';
import { Fcn } from 'common/types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';
import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';

import { ServerFactoryParams } from './factoryParams.types';

export default (
  createExpressApp: Fcn<[], Express>,
  serviceFactory: Fcn<[AppConfig], Fcn<[PluginSdkSequelize], PluginSdkService>>,
  modelFactory: Fcn<[IDatabaseConfig], PluginSdkSequelize>
) =>
  (appConfig: AppConfig): ServerFactoryParams => ({
    expressApp: createExpressApp(),
    service: serviceFactory(appConfig)(modelFactory(appConfig.database)),
    appConfig
  });
