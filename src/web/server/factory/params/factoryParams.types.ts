import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Express } from 'express';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';

export interface ServerFactoryParams {
  appConfig: AppConfig;
  expressApp: Express;
  service: PluginSdkService
}
