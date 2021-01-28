import jwtAuthenticationUnbound from './jwtAuthentication.unbound';
import { RequestHandler as JwtRequestHandler, SecretCallbackLong } from 'express-jwt';
import { Fcn } from 'common/types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { DEFAULT_SSO_HASH_ALG } from 'src/defaults';
import { ExpressJwtOptions } from 'jwks-rsa';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`jwt authentication`, () => {
        let jwt: Fcn<[any], JwtRequestHandler>;
        let jwtAuthentication: Fcn<[ISSOConfig], JwtRequestHandler>;
        let expressJwtSecret: Fcn<[ExpressJwtOptions], SecretCallbackLong>;

        const ssoConfig: ISSOConfig = {
          ssoJwksUri: 'http://jwt.uri.com',
          ssoIssuer: 'http://jwt.issuer.com',
          ssoHashAlg: DEFAULT_SSO_HASH_ALG
        } as ISSOConfig;

        beforeAll(() => {
          jwt = jest.fn().mockImplementation((_options: any) => ({} as JwtRequestHandler));
          expressJwtSecret = jest.fn().mockImplementation((_options: ExpressJwtOptions) => null);
          jwtAuthentication = jwtAuthenticationUnbound.apply(null, [jwt, expressJwtSecret]);
        });

        it('Should be called with exact options and validate jwt bearer token', () => {
          const expressJwtOptions: ExpressJwtOptions = {
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: ssoConfig.ssoJwksUri
          };

          const jwtOptions: any = {
            secret: null,
            requestProperty: 'jwt',
            issuer: ssoConfig.ssoIssuer,
            algorithms: [ssoConfig.ssoHashAlg]
          };

          jwtAuthentication(ssoConfig);
          expect(expressJwtSecret)
            .toHaveBeenCalledWith(expressJwtOptions);
          expect(jwt)
            .toHaveBeenCalledWith(jwtOptions);
        });
      });
    });
  });
});
