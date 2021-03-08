import { errorLogger } from 'express-winston';
import expressLoggerOptions from '../options/options';
import { ErrorRequestHandler } from 'express';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Maybe } from 'tsmonad';

export default (appConfig: AppConfig): ErrorRequestHandler =>
  Maybe.just(appConfig)
    .bind(expressLoggerOptions)
    .lift(errorLogger)
    .caseOf({
      just: (loggerHandler: ErrorRequestHandler): ErrorRequestHandler => loggerHandler,
      nothing: () => null
    });
