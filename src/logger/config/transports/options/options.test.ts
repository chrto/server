import optionsUnbound from './options.unbound';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ColorizeOptions, Colorizer, Format } from 'logform';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { SplunkTransportOptions, TransportOptions } from './options.types';
import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';

const CONFIG: ILoggerConfig = {
  fileNameExceptions: 'ex.log',
  fileDatePattern: 'DD',
  fileZipArchive: true,
  dir: './logs',
  fileMaxSize: 1024,
  fileMaxFiles: '14d',
  consoleLevel: 'debug',
  splunkLevel: 'debug',
  splunkToken: 's_token',
  splunkIndex: 's_index',
  splunkSource: 's_source',
  splunkSourceType: 's_source_type',
  splunkHost: 's_host',
  splunkPort: 8104,
  splunkPath: 's/path',
  splunkProtocol: 's_proto'
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
          expect(result.file).toBeObject;
          expect(result.file).toStrictEqual(expected);
        });

        it(`Should create exact console transport options`, () => {
          const expected: ConsoleTransportOptions = {
            level: CONFIG.consoleLevel,
            handleExceptions: true,
            format: LOGFORM_FORMAT
          };
          expect(result.console).toBeObject;
          expect(result.console).toStrictEqual(expected);
        });

        it(`Should create exact exceptions transport options`, () => {
          const expected: FileTransportOptions = {
            filename: CONFIG.fileNameExceptions,
            dirname: CONFIG.dir,
            format: LOGFORM_FORMAT
          };
          expect(result.exceptions).toBeObject;
          expect(result.exceptions).toStrictEqual(expected);
        });

        it(`Should create exact splunk transport options`, () => {
          const expected: SplunkTransportOptions = {
            level: CONFIG.splunkLevel,
            splunk: {
              token: CONFIG.splunkToken,
              index: CONFIG.splunkIndex,
              source: CONFIG.splunkSource,
              sourcetype: CONFIG.splunkSourceType,
              host: CONFIG.splunkHost,
              port: CONFIG.splunkPort,
              path: CONFIG.splunkPath,
              protocol: CONFIG.splunkProtocol
            }
          };
          expect(result.splunk).toBeObject;
          expect(result.splunk).toStrictEqual(expected);
        });

        it(`Should create splunk transport options item, only if not null`, () => {
          const expected: SplunkTransportOptions = {
            level: CONFIG.splunkLevel,
            splunk: {
              token: CONFIG.splunkToken
            }
          };

          expect(
            optionsUnbound
              .apply(null, [{ combine, colorize }])
              .apply(null, [{
                ...CONFIG,
                splunkIndex: null,
                splunkSource: null,
                splunkSourceType: null,
                splunkHost: null,
                splunkPort: null,
                splunkPath: null,
                splunkProtocol: null
              }])
              .apply(null, [LOGFORM_FORMAT])
              .splunk
          )
            .toStrictEqual(expected);
        });
      });
    });
  });
});
