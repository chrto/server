import { Logger } from 'winston';
import { AppConfig } from '../loader/appConfig.types';
import { IDatabaseConfig } from '../loader/database/databaseConfig.types';
import { ILoggerConfig } from '../loader/logger/loggerConfig.types';
import { ENodeENV } from '../loader/nodeEnv/nodeEnvConfig.types';
import { IServerConfig } from '../loader/server/serverConfig.types';
import { ISSOConfig } from '../loader/sso/ssoConfig.types';
import { AppConfigLogger } from './logger.types';
import configLoggerUnbound from './logger.unbound';

describe('server configuration module', () => {
  describe(`'logger'`, () => {
    let mockLogger: Logger = {} as Logger;
    const config: AppConfig = {
      environment: ENodeENV.development,
      server: {} as IServerConfig,
      database: {} as IDatabaseConfig,
      sso: {} as ISSOConfig,
      appLogger: {} as ILoggerConfig
    };

    beforeAll(() => {
      mockLogger.debug = jest.fn().mockImplementation((_msg: string) => mockLogger);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it(`Should log server configuration, if 'NODE_ENV' is set to 'development'`, () => {
      const configLogger: AppConfigLogger = configLoggerUnbound.apply(null, [mockLogger]);

      configLogger(config);
      expect(mockLogger.debug)
        .toHaveBeenCalled();
    });
    it(`Should not log server configuration, if 'NODE_ENV' is not set to 'development'`, () => {
      const configLogger: (appConfig: AppConfig) => AppConfig = configLoggerUnbound.apply(null, [mockLogger]);

      configLogger({ ...config, environment: ENodeENV.production });
      expect(mockLogger.debug)
        .not.toHaveBeenCalled();
    });
  });
});
