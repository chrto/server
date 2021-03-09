import registerMiddlewares from 'web/serverModules/configuration/middlewares/registerMiddlewares';
import middlewares from 'web/serverModules/common/middlewares/middlewares';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Context as GlobalContext } from '../../context/context.types';
import { ModuleConfig } from 'web/serverModules/types';

const { cors, logger } = middlewares;
const { expressLogger, expressErrorLogger } = logger;

export default (appConfig: AppConfig): ModuleConfig<GlobalContext> =>
  registerMiddlewares.apply(null, [[
    cors,
    expressLogger(appConfig),
    expressErrorLogger(appConfig)
  ]]);
