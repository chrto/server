import { Factory } from 'common/types';
import { ErrorRequestHandler, RequestHandler } from 'express';
import { RequestHandler as JwtRequestHandler } from 'express-jwt';
import { PluginSdkService } from 'service/serviceFactory/serviceFactory.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { BodyParser } from './bodyParser/bodyPartser.types';
import { ExpressLogger } from './logger/logger.types';

export type Middleware = ErrorRequestHandler | RequestHandler | JwtRequestHandler;
export type MiddlewareFactory<I, M extends Middleware> = Factory<I, M>;
export default interface MiddlewaresCollection {
  cors: RequestHandler;
  bodyParser: BodyParser;
  authenticationErrorHandler: ErrorRequestHandler;
  errorHandler: ErrorRequestHandler;
  jwtAuthentication: MiddlewareFactory<ISSOConfig, JwtRequestHandler>;
  loadUserJWT: MiddlewareFactory<PluginSdkService, RequestHandler>;
  logger: ExpressLogger;
}
