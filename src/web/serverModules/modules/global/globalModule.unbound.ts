import eitherify from 'utils/either/eitherify/eitherify';
import { Router } from 'express';
import { Either } from 'tsmonad';
import { Logger } from 'winston';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Context as GlobalContext } from './context/context.types';
import { ModuleConfig, ModuleConfigFactory } from 'web/serverModules/types';

export default (
  logger: Logger,
  moduleDefinition: <CTX>(service: PluginSdkService) => ModuleConfigFactory<CTX>,
  moduleMiddlewares: ModuleConfigFactory<GlobalContext>,
  registerErrorHandlerMiddleware: ModuleConfigFactory<GlobalContext>,
  registerRoutes: ModuleConfigFactory<GlobalContext>
) =>
  (moduleConfig: ModuleConfig<GlobalContext>) => {
    return (service: PluginSdkService, _appConfig: AppConfig): Router =>
      Either.right<any, ModuleConfig<GlobalContext>>(moduleConfig)
        .lift(moduleDefinition<GlobalContext>(service))
        .bind(eitherify<[ModuleConfig<GlobalContext>], ModuleConfig<GlobalContext>>(moduleMiddlewares))
        .bind(eitherify<[ModuleConfig<GlobalContext>], ModuleConfig<GlobalContext>>(registerRoutes))
        .bind(eitherify(registerErrorHandlerMiddleware))
        .caseOf({
          right: (moduleConfig: ModuleConfig<GlobalContext>): Router => moduleConfig.router,
          left: (error: any) => {
            logger.error('Error in global module loader..');
            throw error;
          }
        });
  };
