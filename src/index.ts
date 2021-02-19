import 'source-map-support/register';

import lift from 'utils/either/lift/lift';
import asyncLift from 'utils/either/asyncLift/asyncLift';
import errorHandler from 'web/server/errorHandler/errorHandler';
import eitherify from 'utils/either/eitherify/eitherify';
import { ftap, tap, tapLeft } from 'utils/either';
import loadAppConfig from './web/server/configuration/loader/appConfig';
import logAppConfig from './web/server/configuration/logger/logger';
import getServerParams from './web/server/factory/params/factoryParams';
import serverFactory from 'web/server/factory/server/serverFactory';
import registerModules from './web/server/registerModules/registerModules';
import { WebServer } from 'web/server/types';
import logger from 'utils/logger';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { ServerFactoryParams } from 'web/server/factory/params/factoryParams.types';

require('dotenv').config();

export const waitForShutdown = (server: WebServer): void => {
  process
    .on('SIGTERM', server.stop) // listen for TERM signal .e.g. kill
    .on('SIGINT', server.stop);  // listen for INT signal e.g. Ctrl-C
};

const startServer = (server: WebServer): Promise<WebServer> => server.start();

Promise.resolve(loadAppConfig())
  .then(tap<AppConfig>(logAppConfig))
  .then(lift<AppConfig, ServerFactoryParams>(getServerParams))
  .then(ftap<ServerFactoryParams>(eitherify<[ServerFactoryParams], void>(registerModules)))
  .then(lift<ServerFactoryParams, WebServer>(serverFactory))
  .then(tap<WebServer>(logger.debug.bind(null, 'starting server...')))
  .then(asyncLift<WebServer, WebServer>(startServer))
  .then(tap<WebServer>(waitForShutdown))
  .then(tapLeft<WebServer>(errorHandler))
  .catch(errorHandler);
