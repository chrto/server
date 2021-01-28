import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Context as AuthContext } from './context/context.types';
import { ModuleConfig, ModuleConfigFactory } from 'web/serverModules/types';
import { Router } from 'express';
import { Either } from 'tsmonad';
import { eitherify } from 'utils/either';
import { Logger } from 'winston';

export default (
  logger: Logger,
  moduleDefinition: <CTX>(service: PluginSdkService) => ModuleConfigFactory<CTX>,
  moduleMiddlewares: ModuleConfigFactory<AuthContext>,
  registerErrorHandlerMiddleware: ModuleConfigFactory<AuthContext>,
  registerRoutes: ModuleConfigFactory<AuthContext>
) =>
  (moduleConfig: ModuleConfig<AuthContext>) => {
    return (service: PluginSdkService, _appConfig: AppConfig): Router =>
      Either.right<any, ModuleConfig<AuthContext>>(moduleConfig)
        .lift(moduleDefinition<AuthContext>(service))
        .bind(eitherify<[ModuleConfig<AuthContext>], ModuleConfig<AuthContext>>(moduleMiddlewares))
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
