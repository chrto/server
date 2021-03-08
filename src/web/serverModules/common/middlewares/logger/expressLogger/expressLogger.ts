import { logger } from 'express-winston';
import { RequestHandler } from 'express';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import expressLoggerOptions from '../options/options';
import { Maybe } from 'tsmonad';

export default (appConfig: AppConfig): RequestHandler =>
  Maybe.just(appConfig)
    .bind(expressLoggerOptions)
    .lift(logger)
    .caseOf({
      just: (loggerHandler: RequestHandler): RequestHandler => loggerHandler,
      nothing: () => null
    });
