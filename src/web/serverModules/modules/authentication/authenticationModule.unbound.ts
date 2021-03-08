import eitherify from 'utils/monad/either/eitherify/eitherify';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Context as AuthContext } from './context/context.types';
import { ModuleConfig, ModuleConfigFactory } from 'web/serverModules/types';
import { Router } from 'express';
import { Either } from 'tsmonad';
import { Logger } from 'winston';
import { Fcn } from 'common/types';

export default (
  logger: Logger,
  moduleDefinition: <CTX>(service: PluginSdkService) => ModuleConfigFactory<CTX>,
  moduleMiddlewares: Fcn<[AppConfig], ModuleConfigFactory<AuthContext>>,
  registerErrorHandlerMiddleware: ModuleConfigFactory<AuthContext>,
  registerRoutes: ModuleConfigFactory<AuthContext>
) =>
  (moduleConfig: ModuleConfig<AuthContext>) => {
    return (service: PluginSdkService, appConfig: AppConfig): Router =>
      Either.right<any, ModuleConfig<AuthContext>>(moduleConfig)
        .lift(moduleDefinition<AuthContext>(service))
        .bind(eitherify<[ModuleConfig<AuthContext>], ModuleConfig<AuthContext>>(moduleMiddlewares(appConfig)))
        .bind(eitherify<[ModuleConfig<AuthContext>], ModuleConfig<AuthContext>>(registerRoutes))
        .bind(eitherify(registerErrorHandlerMiddleware))
        .caseOf({
          right: (moduleConfig: ModuleConfig<AuthContext>): Router => moduleConfig.router,
          left: (error: any) => {
            logger.error('Error in authentication module loader..');
            throw error;
          }
        });
  };
