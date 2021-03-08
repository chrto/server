import { Format } from 'logform';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { TransportOptions } from './options.types';

export default ({ combine, colorize }) =>
  (loggerConfig: ILoggerConfig) =>
    (customFormat: Format): TransportOptions => ({
      file: {
        filename: null,
        level: null,
        datePattern: loggerConfig.fileDatePattern,
        zippedArchive: loggerConfig.fileZipArchive,
        dirname: loggerConfig.dir,
        maxSize: loggerConfig.fileMaxSize,
        maxFiles: loggerConfig.fileMaxFiles,
        format: customFormat
      },
      console: {
        level: loggerConfig.consoleLevel,
        handleExceptions: true,
        format: combine(
          colorize({ all: true }),
          customFormat
        )
      },
      exceptions: {
        filename: loggerConfig.fileNameExceptions,
        dirname: loggerConfig.dir,
        format: customFormat
      }
    });
