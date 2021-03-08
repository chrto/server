import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export interface TransportOptions {
  console: ConsoleTransportOptions;
  exceptions: FileTransportOptions;
  file: DailyRotateFile.DailyRotateFileTransportOptions;
}
