import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { ExpressJwtOptions } from 'jwks-rsa';
import { RequestHandler as JwtRequestHandler, SecretCallbackLong } from 'express-jwt';
import { Fcn } from 'common/types';

export default (
  jwt: Fcn<[any], JwtRequestHandler>,
  expressJwtSecret: Fcn<[ExpressJwtOptions], SecretCallbackLong>
) =>
  (ssoConfig: ISSOConfig): JwtRequestHandler =>
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: ssoConfig.ssoJwksUri
      }),
      requestProperty: 'jwt',
      issuer: ssoConfig.ssoIssuer,
      algorithms: [ssoConfig.ssoHashAlg]
    });
