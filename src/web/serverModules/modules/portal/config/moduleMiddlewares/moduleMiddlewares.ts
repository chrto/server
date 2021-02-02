import registerMiddlewares from 'web/serverModules/configuration/middlewares/registerMiddlewares';
import middlewares from 'web/serverModules/common/middlewares/middlewares';
import { OptionsJson } from 'body-parser';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';

const MEGA_BYTE: number = 1024 * 1024;
const JSON_OPTIONS: OptionsJson = { limit: 1 * MEGA_BYTE, type: 'application/json' };

const { cors, logger, bodyParser, jwtAuthentication, loadUserJWT, authenticationErrorHandler } = middlewares;
const { expressLogger, expressErrorLogger } = logger;
const { json } = bodyParser;

export default (appConfig?: AppConfig, service?: PluginSdkService) =>
  registerMiddlewares.apply(null, [[
    cors,
    json(JSON_OPTIONS),
    expressLogger,
    expressErrorLogger,
    jwtAuthentication(appConfig.sso),
    loadUserJWT(service),
    authenticationErrorHandler
  ]]);
