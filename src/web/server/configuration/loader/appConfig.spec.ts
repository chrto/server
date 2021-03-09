import loadAppConfigUnbound from './appConfig.unbound';
import nodeEnvConfigUnbound from './nodeEnv/nodeEnvConfig.unbound';
import databaseConfigUnbound from './database/databaseConfig.unbound';
import serverConfigUnbound from './server/serverConfig.unbound';
import ssoConfigUnbound from './sso/ssoConfig.unbound';
import loggerConfigUnbound from './logger/loggerConfig.unbound';
import { expect as expectChai } from 'chai';
import { AppConfig, AppConfigLoader } from './appConfig.types';
import { ENodeENV } from './nodeEnv/nodeEnvConfig.types';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';

const env = {
  NODE_ENV: 'production',
  SSO_ISSUER: 'http://localhost:8101/auth/realms/demo',
  SSO_WELL_KNOWN: 'http://localhost:8101/auth/realms/demo/.well-known/openid-configuration',
  SSO_JWKS_URI: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/certs',
  SSO_TOKEN_ENDPOINT: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/token',
  SSO_END_SESSION_ENDPOINT: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/logout',
  SSO_HASH_ALG: 'RS256',
  SSO_CLIENT_ID: 'client_id',
  SSO_CLIENT_SECRET: 'client_secret',
  SSO_REDIRECT_URI: '= http://localhost:8080/callback',
};

describe('server configuration module', () => {
  describe(`'AppConfig'`, () => {
    const loadNodeEnvConfiguration: AppConfigLoader<Either<AppError, AppConfig>> = nodeEnvConfigUnbound.apply(null, [ENodeENV[env.NODE_ENV]]);
    const loadDatabaseConfiguration: AppConfigLoader<AppConfig> = databaseConfigUnbound.apply(null, [env]);
    const loadServerConfiguration: AppConfigLoader<AppConfig> = serverConfigUnbound.apply(null, [env]);
    const loadSSOConfiguration: AppConfigLoader<Either<AppError, AppConfig>> = ssoConfigUnbound.apply(null, [env]);
    const loadLoggerConfiguration: AppConfigLoader<Either<AppError, AppConfig>> = loggerConfigUnbound.apply(null, [env]);

    const loadAppConfig = loadAppConfigUnbound.apply(null, [{ loadNodeEnvConfiguration, loadDatabaseConfiguration, loadServerConfiguration, loadSSOConfiguration, loadLoggerConfiguration }]);
    loadAppConfig()
      .do({
        right: (appConfig: AppConfig) => {
          it(`should have 5 own properties`, () => {
            expectChai(Object.keys(appConfig).length)
              .to.be.equal(5);
          });
          it(`should have own property 'environment'`, () => {
            expectChai(appConfig)
              .haveOwnProperty('environment');
          });
          it(`should have own property 'server'`, () => {
            expectChai(appConfig)
              .haveOwnProperty('server');
          });
          it(`should have own property 'database'`, () => {
            expectChai(appConfig)
              .haveOwnProperty('database');
          });
          it(`should have own property 'sso'`, () => {
            expectChai(appConfig)
              .haveOwnProperty('sso');
          });
          it(`should have own property 'logger'`, () => {
            expectChai(appConfig)
              .haveOwnProperty('appLogger');
          });
        },
        left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
      });
  });
});
