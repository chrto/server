import { DEFAULT_SERVER_API_PORT, DEFAULT_SERVER_RETRY_COUNT, DEFAULT_SERVER_SHUTDOWN_PORT, DEFAULT_SERVER_SHUTDOWN_TIMEOUT, DEFAULT_SERVER_STARTUP_DELAY } from 'src/defaults';
import { AppConfig } from '../appConfig.types';

export default (env: NodeJS.ProcessEnv) =>
  (appConfig: AppConfig = {} as AppConfig): AppConfig => ({
    ...appConfig,
    server: {
      apiPort: !!env.API_PORT && Number(env.API_PORT) || DEFAULT_SERVER_API_PORT,
      shutdownPort: !!env.SHUTDOWN_PORT && Number(env.SHUTDOWN_PORT) || DEFAULT_SERVER_SHUTDOWN_PORT,
      shutdownTimeout: !!env.SHUTDOWN_TIMEOUT && Number(env.SHUTDOWN_TIMEOUT) || DEFAULT_SERVER_SHUTDOWN_TIMEOUT,
      startupDelay: !!env.STARTUP_DELAY && Number(env.STARTUP_DELAY) || DEFAULT_SERVER_STARTUP_DELAY,
      retryCount: !!env.RETRY_COUNT && Number(env.RETRY_COUNT) || DEFAULT_SERVER_RETRY_COUNT
    }
  });
