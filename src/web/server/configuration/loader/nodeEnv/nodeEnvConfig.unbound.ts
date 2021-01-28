import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { isMissing } from 'utils/validation';
import InvalidConfiguraton from '../../error/configuration/error';
import { AppConfig } from '../appConfig.types';
import { ENodeENV } from './nodeEnvConfig.types';

export default (node_env: ENodeENV) =>
  (appConfig: AppConfig = {} as AppConfig): Either<AppError, AppConfig> =>
    !isMissing(node_env)
      ? Either.right<AppError, AppConfig>({
        ...appConfig,
        environment: node_env
      })
      : Either.left<AppError, AppConfig>(new InvalidConfiguraton('Environment configuration was not loaded. Unknown NODE_ENV variable.'));
