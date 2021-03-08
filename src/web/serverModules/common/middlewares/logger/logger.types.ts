import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { MiddlewareFactory } from '../middlewares.types';

export interface ExpressLogger {
  expressErrorLogger: MiddlewareFactory<AppConfig, ErrorRequestHandler>;
  expressLogger: MiddlewareFactory<AppConfig, RequestHandler>;
}
