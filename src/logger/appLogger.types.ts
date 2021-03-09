import { AppConfig } from 'web/server/configuration/loader/appConfig.types';

export interface IAppLogger {
  init: (config: AppConfig) => IAppLogger;
  error: (message: string) => IAppLogger;
  debug: (message: string) => IAppLogger;
  info: (message: string) => IAppLogger;
}
