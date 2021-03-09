import { LoggerOptions } from 'express-winston';
import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Maybe } from 'tsmonad';
import { Response } from 'express';
import { TransportsDefinition } from 'logger/config/transports/transports.types';
import { Fcn } from 'common/types';
import { AppRequest } from 'web/serverModules/types';

export default (
  getTransportsDefinition: Fcn<[AppConfig], Maybe<TransportsDefinition>>,
  messageTemplate: Fcn<[AppRequest, Response], string>
) =>
  (appConfig: AppConfig): Maybe<LoggerOptions> =>
    getTransportsDefinition(appConfig)
      .lift((transportsDefinition: TransportsDefinition): LoggerOptions => ({
        transports: transportsDefinition.logger,
        expressFormat: false,
        msg: messageTemplate
      }));
