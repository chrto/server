import transportsUnbound from './build.unbound';
import { expect as expectChai } from 'chai';
import { ConsoleTransportOptions, FileTransportOptions } from 'winston/lib/winston/transports';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { SplunkTransportOptions, TransportOptions } from '../options/options.types';
import { ILoggerConfig } from 'web/server/configuration/loader/logger/loggerConfig.types';
import { TransportsDefinition } from '../transports.types';

function File (opt: FileTransportOptions): void {
  this.filename = opt.filename;
  this.handleExceptions = opt.handleExceptions;
  this.dirname = opt.dirname;
  // ...
};

function DailyRotateFile (opt: DailyRotateFileTransportOptions): void {
  this.filename = opt.filename;
  this.dirname = opt.dirname;
  // ...
};

function Console (opt: ConsoleTransportOptions): void {
  this.level = opt.level;
  this.handleExceptions = opt.handleExceptions;
  // ...
};

function SplunkStreamEvent (opt: SplunkTransportOptions): void {
  this.level = opt.level;
  // ...
};

const OPTIONS: TransportOptions = {
  file: {
    filename: 'exceptions.log',
    dirname: './logs'
  },
  console: {
    level: 'debug',
    handleExceptions: true
  },
  exceptions: {
    filename: 'exceptions.log',
    handleExceptions: true,
    dirname: './logs'
  },
  splunk: {
    splunk: {
      token: 's_token',
      host: 's_host',
      port: 8104,
      path: 's_path',
      protocol: 's_proto'
    }
  }
};
const CONFIG: ILoggerConfig = {
  fileNameInfo: 'info.log',
  fileLevel: 'debug',
  fileNameError: 'error.log'
} as ILoggerConfig;

describe('Logger', () => {
  describe('config', () => {
    describe('transports', () => {
      describe('build ', () => {
        let transports;

        beforeAll(() => {
          transports = transportsUnbound
            .apply(null, [{ Console, File }, DailyRotateFile, SplunkStreamEvent]);
        });

        it(`Should return TransportsDefinition object`, () => {
          const result: TransportsDefinition = transports
            .apply(null, [{ ...CONFIG }])
            .apply(null, [OPTIONS]);

          expectChai(result)
            .to.be.an({}.constructor.name);
          expectChai(result)
            .has.ownProperty('logger');
          expectChai(result)
            .has.ownProperty('exception');
        });

        it(`Should return list of exact 3 logger transports in logger item, if console log has been enabled`, () => {
          const expected = [
            new Console(OPTIONS.console),
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameInfo, level: CONFIG.fileLevel, stream: undefined }),
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameError, level: 'error', stream: undefined })
          ];

          const result: TransportsDefinition = transports
            .apply(null, [{ ...CONFIG, consoleEnable: true }])
            .apply(null, [OPTIONS]);

          expectChai(result.logger)
            .to.be.an([].constructor.name)
            .which.has.length(3)
            .and.has.deep.members(expected);
        });

        it(`Should return list of exact 3 logger transports in logger item, if splunk log has been enabled`, () => {
          const expected = [
            new SplunkStreamEvent(OPTIONS.splunk),
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameInfo, level: CONFIG.fileLevel, stream: undefined }),
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameError, level: 'error', stream: undefined })
          ];

          const result: TransportsDefinition = transports
            .apply(null, [{ ...CONFIG, splunkEnable: true }])
            .apply(null, [OPTIONS]);

          expectChai(result.logger)
            .to.be.an([].constructor.name)
            .which.has.length(3)
            .and.has.deep.members(expected);
        });

        it(`Should return list of exact 2 logger transports in logger item, if console and splunk log has been disabled `, () => {
          const expected = [
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameInfo, level: CONFIG.fileLevel, stream: undefined }),
            new DailyRotateFile({ ...OPTIONS.file, filename: CONFIG.fileNameError, level: 'error', stream: undefined })
          ];

          const result: TransportsDefinition = transports
            .apply(null, [{ ...CONFIG, consoleEnable: false }])
            .apply(null, [OPTIONS]);

          expectChai(result.logger)
            .to.be.an([].constructor.name)
            .which.has.length(2)
            .and.has.deep.members(expected);
        });

        it(`Should return list of exact 1 logger exception transports in exception item`, () => {
          const expected = [
            new File(OPTIONS.exceptions),
          ];

          const result: TransportsDefinition = transports
            .apply(null, [{ ...CONFIG, consoleEnable: false }])
            .apply(null, [OPTIONS]);

          expectChai(result.exception)
            .to.be.an([].constructor.name)
            .which.has.length(1)
            .and.has.deep.members(expected);
        });
      });
    });
  });
});
