import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { ExpressJwtOptions } from 'jwks-rsa';
import { RequestHandler as JwtRequestHandler } from 'express';
import { GetVerificationKey, Params } from 'express-jwt';
import { Fcn } from 'common/types';
import { MiddlewareFactory } from '../middlewares.types';

export default (
  jwt: MiddlewareFactory<Params, JwtRequestHandler>,
  expressJwtSecret: Fcn<[ExpressJwtOptions], GetVerificationKey>
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
