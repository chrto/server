import { WebServer } from '../../../types';
import { ServerFactoryParams } from '../../params/factoryParams.types';
import { Fcn } from 'common/types';
import { PluginSdkSequelize } from 'model/sequelize/modelFactory/modelFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { IDatabaseConfig } from 'web/server/configuration/loader/database/databaseConfig.types';
import { pipe } from 'ramda';


export default (
  serviceFactory:  Fcn<[AppConfig],Fcn<[PluginSdkSequelize], PluginSdkService>>,
  modelFactory: Fcn<[IDatabaseConfig], PluginSdkSequelize>,
  unregisterRouters: Fcn<[WebServer], WebServer>,
  registerModules: Fcn<[ServerFactoryParams], ServerFactoryParams>
) =>
  (server?: WebServer) =>
    (params: ServerFactoryParams): WebServer =>
      pipe(
        modelFactory,
        serviceFactory(params.appConfig),
        (service: PluginSdkService): ServerFactoryParams => ({
          ...params,
          service
        }),
        (serverFactoryParams: ServerFactoryParams) => (unregisterRouters(server), serverFactoryParams),
        (serverFactoryParams: ServerFactoryParams) => (registerModules({ ...serverFactoryParams, expressApp: server.expressApp }), server)

      )(params.appConfig.database)
