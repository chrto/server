import { Either } from 'tsmonad';
import { AppConfig, ConfigurationLoaders } from './appConfig.types';
import { AppError } from 'common/error';

export default (loaders: ConfigurationLoaders) =>
  (): Either<AppError, AppConfig> =>
    Either.right({})
      .bind(loaders.loadNodeEnvConfiguration)
      .lift(loaders.loadServerConfiguration)
      .lift(loaders.loadDatabaseConfiguration)
      .bind(loaders.loadSSOConfiguration)
      .lift(loaders.loadLoggerConfiguration);
