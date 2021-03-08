
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { TransportOptions } from '../options/options.types';
import { TransportsDefinition } from '../transports.types';

export default ({ Console, File }, DailyRotateFile) =>
  (loggerConfig: ILoggerConfig) =>
    (transportOptions: TransportOptions): TransportsDefinition => ({
      logger: [
        ...[
          new DailyRotateFile({ ...transportOptions.file, filename: loggerConfig.fileNameInfo, level: loggerConfig.fileLevel, stream: undefined }),
          new DailyRotateFile({ ...transportOptions.file, filename: loggerConfig.fileNameError, level: 'error', stream: undefined })
        ],
        ...loggerConfig.consoleEnable && [new Console(transportOptions.console)] || []
      ],
      exception: [
        new File(transportOptions.exceptions)
      ]
    });
