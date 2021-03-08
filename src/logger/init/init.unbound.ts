import { COLORS } from './config';
import * as mkdirp from 'mkdirp';

import { Maybe } from 'tsmonad';
import { Logger, LoggerOptions } from 'winston';
import { AbstractConfigSetColors } from 'winston/lib/winston/config';
import * as Transport from 'winston-transport';

import { AppConfig } from 'web/server/configuration/loader/appConfig.types';
import { Fcn } from 'common/types';
import { IAppLogger } from '../appLogger.types';

export default (isMasterCluster: boolean) =>
  (addColors: Fcn<[AbstractConfigSetColors], any>) =>
    (
      transports: Fcn<[AppConfig], Maybe<Transport[]>>,
      loggerOptions: Fcn<[Transport[]], LoggerOptions>,
      buildLogger: Fcn<[LoggerOptions], Logger>
    ) =>
      function (appConfig: AppConfig): IAppLogger {
        Maybe.maybe(appConfig)
          .do({
            just: (appConfig: AppConfig): void => {
              if (isMasterCluster) {
                mkdirp.sync(appConfig.appLogger.dir);  // TODO
              }
            }
          })
          .do({
            just: (): void => {
              addColors(COLORS);
            }
          })
          .bind(transports)
          .lift(loggerOptions)
          .lift(buildLogger)
          .do({
            just: (logger: Logger): void => {
              this.logger = logger;
            }
          });
        return this;
      };
