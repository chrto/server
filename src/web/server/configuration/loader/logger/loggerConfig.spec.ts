import loggerConfigUnbound from './loggerConfig.unbound';
import { expect as expectChai } from 'chai';
import { AppConfig, AppConfigLoader } from '../appConfig.types';
import { ILoggerConfig } from './loggerConfig.types';
import { DEFAULT_LOG_CONSOLE_ENABLE, DEFAULT_LOG_CONSOLE_LEVEL, DEFAULT_LOG_DIR, DEFAULT_LOG_FILE_DATE_PATTERN, DEFAULT_LOG_FILE_LEVEL, DEFAULT_LOG_FILE_MAX_FILES, DEFAULT_LOG_FILE_MAX_SIZE, DEFAULT_LOG_FILE_NAME_ERROR, DEFAULT_LOG_FILE_NAME_INFO, DEFAULT_LOG_FILE_ZIP_ARCH, DEFAULT_LOG_LABEL } from 'src/defaults';

describe('server configuration module', () => {
  describe(`'logger'`, () => {
    const env = {
      LOG_LABEL: 'server',
      LOG_DIR: '/logs',
      LOG_FILE_LEVEL: 'debug',
      LOG_FILE_NAME_INFO: 'info.log',
      LOG_FILE_NAME_ERROR: 'error.log',
      LOG_FILE_DATE_PATTERN: 'DD',
      LOG_FILE_ZIP_ARCH: '0',
      LOG_FILE_MAX_SIZE: '1024',
      LOG_FILE_MAX_FILES: '14s',
      LOG_CONSOLE_LEVEL: 'debug',
      LOG_CONSOLE_ENABLE: '0'
    };

    it(`Should use values from environment, if exists.`, () => {
      const expected: ILoggerConfig = {
        label: env.LOG_LABEL,
        dir: env.LOG_DIR,
        fileLevel: env.LOG_FILE_LEVEL,
        fileNameInfo: env.LOG_FILE_NAME_INFO,
        fileNameError: env.LOG_FILE_NAME_ERROR,
        fileDatePattern: env.LOG_FILE_DATE_PATTERN,
        fileZipArchive: false,
        fileMaxSize: Number(env.LOG_FILE_MAX_SIZE),
        fileMaxFiles: env.LOG_FILE_MAX_FILES,
        consoleLevel: env.LOG_CONSOLE_LEVEL,
        consoleEnable: false,
      };
      const loggerConfig: AppConfigLoader<AppConfig> = loggerConfigUnbound.apply(null, [env]);

      expectChai(loggerConfig())
        .to.haveOwnProperty('logger')
        .which.is.deep.equal(expected);
    });

    it(`Should use values from 'defaults.ts', if does not find in environment.`, () => {
      const expected: ILoggerConfig = {
        label: DEFAULT_LOG_LABEL,
        dir: DEFAULT_LOG_DIR,
        fileLevel: DEFAULT_LOG_FILE_LEVEL,
        fileNameInfo: DEFAULT_LOG_FILE_NAME_INFO,
        fileNameError: DEFAULT_LOG_FILE_NAME_ERROR,
        fileDatePattern: DEFAULT_LOG_FILE_DATE_PATTERN,
        fileZipArchive: DEFAULT_LOG_FILE_ZIP_ARCH,
        fileMaxSize: DEFAULT_LOG_FILE_MAX_SIZE,
        fileMaxFiles: DEFAULT_LOG_FILE_MAX_FILES,
        consoleLevel: DEFAULT_LOG_CONSOLE_LEVEL,
        consoleEnable: DEFAULT_LOG_CONSOLE_ENABLE,
      };
      const loggerConfig: AppConfigLoader<AppConfig> = loggerConfigUnbound.apply(null, [{}]);

      expectChai(loggerConfig())
        .to.haveOwnProperty('logger')
        .which.is.deep.equal(expected);
    });

    it(`Should use values from 'defaults.ts', if 'LOG_CONSOLE_ENABLE' and 'LOG_FILE_ZIP_ARCH' is not a number`, () => {
      const loggerConfig: AppConfigLoader<AppConfig> = loggerConfigUnbound.apply(null, [{ LOG_CONSOLE_ENABLE: 'aa', LOG_FILE_ZIP_ARCH: 'aa' }]);
      const config: ILoggerConfig = loggerConfig().logger;
      expectChai(config)
        .to.haveOwnProperty('fileZipArchive')
        .which.is.equal(DEFAULT_LOG_FILE_ZIP_ARCH);
      expectChai(config)
        .to.haveOwnProperty('consoleEnable')
        .which.is.equal(DEFAULT_LOG_CONSOLE_ENABLE);
    });

    it(`Should set 'fileMaxSize' and 'fileMaxFiles' as number`, () => {
      const loggerConfig: AppConfigLoader<AppConfig> = loggerConfigUnbound.apply(null, [{ LOG_FILE_MAX_SIZE: '1024', LOG_FILE_MAX_FILES: '14' }]);
      const config: ILoggerConfig = loggerConfig().logger;
      expectChai(config)
        .to.haveOwnProperty('fileMaxSize')
        .which.is.an('number')
        .and.is.equal(1024);
      expectChai(config)
        .to.haveOwnProperty('fileMaxFiles')
        .which.is.an('number')
        .and.is.equal(14);
    });

    it(`Should set 'fileMaxSize' and 'fileMaxFiles' as string`, () => {
      const loggerConfig: AppConfigLoader<AppConfig> = loggerConfigUnbound.apply(null, [{ LOG_FILE_MAX_SIZE: '5m', LOG_FILE_MAX_FILES: '14d' }]);
      const config: ILoggerConfig = loggerConfig().logger;
      expectChai(config)
        .to.haveOwnProperty('fileMaxSize')
        .which.is.an('string')
        .and.is.equal('5m');
      expectChai(config)
        .to.haveOwnProperty('fileMaxFiles')
        .which.is.an('string')
        .and.is.equal('14d');
    });
  });
});
