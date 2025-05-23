import { DEFAULT_SERVER_API_PORT, DEFAULT_SERVER_RETRY_COUNT, DEFAULT_SERVER_SHUTDOWN_PORT, DEFAULT_SERVER_SHUTDOWN_TIMEOUT, DEFAULT_SERVER_STARTUP_DELAY } from 'src/defaults';
import { AppConfig, AppConfigLoader } from '../appConfig.types';
import { IServerConfig } from './serverConfig.types';
import serverConfigUnbound from './serverConfig.unbound';

describe('server configuration module', () => {
  describe(`'server'`, () => {
    const env = {
      API_PORT: '8000',
      SHUTDOWN_PORT: '8001',
      SHUTDOWN_TIMEOUT: '2000',
      STARTUP_DELAY: '1000',
      RETRY_COUNT: '5'
    };

    it(`Should use values from environment, if exists.`, () => {
      const expected: IServerConfig = {
        apiPort: Number(env.API_PORT),
        shutdownPort: Number(env.SHUTDOWN_PORT),
        shutdownTimeout: Number(env.SHUTDOWN_TIMEOUT),
        startupDelay: Number(env.STARTUP_DELAY),
        retryCount: Number(env.RETRY_COUNT)
      };
      const serverConfig: AppConfigLoader<AppConfig> = serverConfigUnbound.apply(null, [env]);

      expect(serverConfig())
        .toHaveProperty('server', expected);
    });

    it(`Should use values from 'defaults.ts', if does not find in environment.`, () => {
      const expected: IServerConfig = {
        apiPort: DEFAULT_SERVER_API_PORT,
        shutdownPort: DEFAULT_SERVER_SHUTDOWN_PORT,
        shutdownTimeout: DEFAULT_SERVER_SHUTDOWN_TIMEOUT,
        startupDelay: DEFAULT_SERVER_STARTUP_DELAY,
        retryCount: DEFAULT_SERVER_RETRY_COUNT
      };
      const serverConfig: AppConfigLoader<AppConfig> = serverConfigUnbound.apply(null, [{}]);

      expect(serverConfig())
        .toHaveProperty ('server', expected);
    });
  });
});
