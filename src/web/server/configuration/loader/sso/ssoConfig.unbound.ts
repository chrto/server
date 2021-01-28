import { AppError } from 'common/error';
import { DEFAULT_SSO_HASH_ALG } from 'src/defaults';
import { Either } from 'tsmonad';
import { isMissing } from 'utils/validation';
import InvalidConfiguraton from '../../error/configuration/error';
import { AppConfig } from '../appConfig.types';

const isENVConfigured = (env: NodeJS.ProcessEnv): boolean =>
  !isMissing(env.SSO_ISSUER) &&
  !isMissing(env.SSO_WELL_KNOWN) &&
  !isMissing(env.SSO_JWKS_URI) &&
  !isMissing(env.SSO_TOKEN_ENDPOINT) &&
  !isMissing(env.SSO_END_SESSION_ENDPOINT) &&
  !isMissing(env.SSO_CLIENT_ID) &&
  !isMissing(env.SSO_CLIENT_SECRET) &&
  !isMissing(env.SSO_REDIRECT_URI);

export default (env: NodeJS.ProcessEnv) =>
  (appConfig: AppConfig = {} as AppConfig): Either<AppError, AppConfig> =>
    isENVConfigured(env)
      ? Either.right<AppError, AppConfig>({
        ...appConfig,
        sso: {
          ssoIssuer: env.SSO_ISSUER,
          ssoWellKnown: env.SSO_WELL_KNOWN,
          ssoJwksUri: env.SSO_JWKS_URI,
          ssoTokenEndpoint: env.SSO_TOKEN_ENDPOINT,
          ssoEndSessionEndpoint: env.SSO_END_SESSION_ENDPOINT,
          ssoHashAlg: !!env.SSO_HASH_ALG && env.SSO_HASH_ALG || DEFAULT_SSO_HASH_ALG,
          ssoClientId: env.SSO_CLIENT_ID,
          ssoClientSecret: env.SSO_CLIENT_SECRET,
          ssoRedirectUri: env.SSO_REDIRECT_URI
        }
      })
      : Either.left<AppError, AppConfig>(new InvalidConfiguraton('SSO configuration was not loaded.'));
