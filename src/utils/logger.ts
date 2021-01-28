import * as cluster from 'cluster';
import { Request, Response } from 'express';
import { Format, TransformableInfo } from 'logform';
import * as mkdirp from 'mkdirp';
import { WORK_DIR } from 'src/defaults';
import { addColors, createLogger, format, LoggerOptions, transports } from 'winston';
import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';

const LOG_LABEL = '[IDOT]';
const CONSOLE_LOG_LEVEL = 'debug';

interface LoggerConfig {
  console: ConsoleTransportOptions;
  file: FileTransportOptions;
}
const { combine, timestamp, label, printf, colorize, prettyPrint, json } = format;
const customPringFormat = printf((info: TransformableInfo): string => {
  return `${info.label} ${info.timestamp} ${info.level} ${info.message}`;
});

const customFormat: Format = combine(
  label({ label: LOG_LABEL }),
  prettyPrint(),
  timestamp(),
  json(),
  customPringFormat
);

const loggerConfig: LoggerConfig = {
  file: {
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 100,
    dirname: `${WORK_DIR}/logs`,
    format: customFormat
  },
  console: {
    level: CONSOLE_LOG_LEVEL,
    handleExceptions: true,
    format: combine(
      colorize({ all: true }),
      customFormat
    )
  }
};

if (cluster.isMaster) {
  mkdirp.sync(loggerConfig.file.dirname);
}

export const transportsDefinition = [
  new transports.Console(loggerConfig.console),
  new transports.File({ ...loggerConfig.file, filename: 'info.log', level: 'info' }),
  new transports.File({ ...loggerConfig.file, filename: 'error.log', level: 'error' })
];

const loggerOptions: LoggerOptions = {
  transports: transportsDefinition
};

const logger = createLogger(loggerOptions);

export const logError = (message?: string) =>
  <E>(e: E): E => {
    logger.error(`\n ${message ? message + '\n' : ''} ${e}`);
    return e;
  };

addColors({
  debug: 'gray',
  error: 'red',
  info: 'white',
  warn: 'yellow'
});

export const skip = (_req: Request, res: Response): boolean => res.statusCode >= 200;

export const stream = {
  write: (message: string, _encoding: string): void => {
    logger.info(message);
  }
};

export default logger;
