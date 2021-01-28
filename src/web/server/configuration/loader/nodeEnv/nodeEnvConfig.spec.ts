import { assert as assertChai, expect as expectChai } from 'chai';
import nodeEnvConfigUnbound from './nodeEnvConfig.unbound';
import { ENodeENV } from './nodeEnvConfig.types';
import { AppConfig, AppConfigLoader } from '../appConfig.types';
import { AppError } from 'common/error';
import InvalidConfiguraton from '../../error/configuration/error';
import { Either } from 'tsmonad';

describe('server configuration module', () => {
  describe(`'NODE_ENV'`, () => {

    it('Happy path', () => {
      const nodeEnvConfig: AppConfigLoader<Either<AppError, AppConfig>> = nodeEnvConfigUnbound.apply(null, [ENodeENV['production']]);
      nodeEnvConfig()
        .do({
          right: (appConfig: AppConfig) => expectChai(appConfig)
            .to.haveOwnProperty('environment')
            .which.is.equal(ENodeENV.production),
          left: (error: AppError) => assertChai
            .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
        });
    });
    it('Error path', () => {
      const nodeEnvConfig: AppConfigLoader<Either<AppError, AppConfig>> = nodeEnvConfigUnbound.apply(null, [null]);
      nodeEnvConfig()
        .do({
          right: (_appConfig: AppConfig) => assertChai
            .fail(null, null, 'Right side was not expected.'),
          left: (error: AppError) => expectChai(error)
            .to.be.instanceOf(InvalidConfiguraton)
        });
    });
  });
});
