import { Fcn } from 'common/types';
import { Express } from 'express';
import { Logger } from 'winston';
import { Server } from 'http';

export default (logger: Logger) =>
  (port: number, infoMessage: string) =>
    (expressApp: Express) =>
      (resolve: Fcn<[Server], void>): void => {
        expressApp.listen(port, function (): void {
          logger.info(infoMessage);
          logger.debug(`on port ${port}`);
          resolve(this);
        });
      };
