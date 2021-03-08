import optionsUnbound from './options.unbound';
import { expect as expectChai } from 'chai';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ColorizeOptions, Colorizer, Format } from 'logform';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { TransportOptions } from './options.types';
import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';

const CONFIG: ILoggerConfig = {
  fileNameExceptions: 'ex.log',
  fileDatePattern: 'DD',
  fileZipArchive: true,
  dir: './logs',
  fileMaxSize: 1024,
  fileMaxFiles: '14d',
  consoleLevel: 'debug',
} as ILoggerConfig;

describe('Logger', () => {
  describe('config', () => {
    describe('transports', () => {
      describe('options', () => {
        let LOGFORM_FORMAT: Format;
        let combine: jest.Mock<Format, [Format[]]>;
        let colorize: jest.Mock<Colorizer, [ColorizeOptions]>;
        let result: TransportOptions;

        beforeAll(() => {
          LOGFORM_FORMAT = { transform: jest.fn().mockReturnValue(LOGFORM_FORMAT) };
          combine = jest.fn().mockReturnValue(LOGFORM_FORMAT);
          colorize = jest.fn().mockReturnValue(LOGFORM_FORMAT);

          result = optionsUnbound
            .apply(null, [{ combine, colorize }])
            .apply(null, [CONFIG])
            .apply(null, [LOGFORM_FORMAT]);
        });

        it(`Should create exact file transport options`, () => {
          const expected: DailyRotateFile.DailyRotateFileTransportOptions = {
            filename: null,
            level: null,
            datePattern: CONFIG.fileDatePattern,
            zippedArchive: CONFIG.fileZipArchive,
            dirname: CONFIG.dir,
            maxSize: CONFIG.fileMaxSize,
            maxFiles: CONFIG.fileMaxFiles,
            format: LOGFORM_FORMAT
          };
          expectChai(result.file)
            .to.be.an({}.constructor.name)
            .which.is.deep.equal(expected);
        });
        it(`Should create exact console transport options`, () => {
          const expected: ConsoleTransportOptions = {
            level: CONFIG.consoleLevel,
            handleExceptions: true,
            format: LOGFORM_FORMAT
          };
          expectChai(result.console)
            .to.be.an({}.constructor.name)
            .which.is.deep.equal(expected);
        });

        it(`Should create exact exceptions transport options`, () => {
          const expected: FileTransportOptions = {
            filename: CONFIG.fileNameExceptions,
            dirname: CONFIG.dir,
            format: LOGFORM_FORMAT
          };
          expectChai(result.exceptions)
            .to.be.an({}.constructor.name)
            .which.is.deep.equal(expected);
        });
      });
    });
  });
});
