import { Logger, LoggerOptions } from 'winston';
import { Fcn } from 'common/types';

export default (createLogger: Fcn<[LoggerOptions], Logger>) =>
  (loggerOptions: LoggerOptions): Logger =>
    createLogger(loggerOptions);
