import ssoConfigUnbound, { getHashAlg } from './ssoConfig.unbound';
import { ISSOConfig } from './ssoConfig.types';
import { DEFAULT_SSO_HASH_ALG } from 'src/defaults';
import { AppConfig, AppConfigLoader } from '../appConfig.types';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import InvalidConfiguraton from '../../error/configuration/error';

describe('server configuration module', () => {
  describe(`'server'`, () => {
    const env = {
      SSO_ISSUER: 'http://localhost:8101/auth/realms/demo',
      SSO_WELL_KNOWN: 'http://localhost:8101/auth/realms/demo/.well-known/openid-configuration',
      SSO_JWKS_URI: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/certs',
      SSO_TOKEN_ENDPOINT: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/token',
      SSO_END_SESSION_ENDPOINT: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/logout',
      SSO_HASH_ALG: 'RS256',
      SSO_CLIENT_ID: 'client_id',
      SSO_CLIENT_SECRET: 'client_secret',
      SSO_REDIRECT_URI: '= http://localhost:8080/callback'

    };

    const expected: ISSOConfig = {
      ssoIssuer: env.SSO_ISSUER,
      ssoWellKnown: env.SSO_WELL_KNOWN,
      ssoJwksUri: env.SSO_JWKS_URI,
      ssoTokenEndpoint: env.SSO_TOKEN_ENDPOINT,
      ssoEndSessionEndpoint: env.SSO_END_SESSION_ENDPOINT,
      ssoHashAlg: getHashAlg(env.SSO_HASH_ALG),
      ssoClientId: env.SSO_CLIENT_ID,
      ssoClientSecret: env.SSO_CLIENT_SECRET,
      ssoRedirectUri: env.SSO_REDIRECT_URI
    };

    it(`Should use values from environment, if exists.`, () => {
      const ssoConfig: AppConfigLoader<Either<AppError, AppConfig>> = ssoConfigUnbound.apply(null, [env]);
      ssoConfig()
        .do({
          right: (appConfig: AppConfig) =>
            expect(appConfig)
              .toHaveProperty('sso', expected),
          left: (error: AppError) => ('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
        });
    });

    it(`Should use 'ssoHashAlg' from defaults, if not specified.`, () => {
      const ssoConfig: AppConfigLoader<Either<AppError, AppConfig>> = ssoConfigUnbound.apply(null, [{ ...env, SSO_HASH_ALG: undefined }]);
      ssoConfig()
        .do({
          right: (appConfig: AppConfig) =>
            expect(appConfig)
              .toHaveProperty('sso', { ...expected, ssoHashAlg: DEFAULT_SSO_HASH_ALG }),
          left: (error: AppError) => fail('Left side was not expected.' + '\n' + error.code + '\n' + error.message)
        });
    });

    it(`Error path.`, () => {
      const ssoConfig: AppConfigLoader<Either<AppError, AppConfig>> = ssoConfigUnbound.apply(null, [{}]);
      ssoConfig()
        .do({
          right: (_appConfig: AppConfig) => fail('Right side was not expected.'),
          left: (error: AppError) => expect(error).toBeInstanceOf(InvalidConfiguraton)
        });
    });
  });
});
