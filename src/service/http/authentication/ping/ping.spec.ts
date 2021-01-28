import { assert as assertChai, expect as expectChai } from 'chai';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

import pingUnbound from './ping';
import { TokenSet } from '../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`ping`, () => {
      let instance: AxiosInstance = {} as AxiosInstance;
      const config: ISSOConfig = {
        ssoWellKnown: 'http://wellknown.endpoint.com'
      } as ISSOConfig;
      let resultOrError: Either<AppError, any>;
      const wellknown: any = {
        issuer: 'http://localhost:8101/auth/realms/demo',
        authorization_endpoint: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/auth',
        token_endpoint: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/token',
        introspection_endpoint: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/token/introspect',
        userinfo_endpoint: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/userinfo',
        end_session_endpoint: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/logout',
        jwks_uri: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/certs',
        check_session_iframe: 'http://localhost:8101/auth/realms/demo/protocol/openid-connect/login-status-iframe.html'
        // ...
      };
      beforeAll(async () => {
        instance.request = jest.fn().mockResolvedValue({
          data: wellknown
        } as AxiosResponse<TokenSet>);

        resultOrError = await pingUnbound
          .apply(null, [instance, config])
          .apply(null, []);
      });

      it('Should call axios request with exact AxiosRequestConfig', () => {
        expect(instance.request).toHaveBeenCalledWith({
          headers: {
            'Accept': 'application/json'
          },
          method: 'get',
          url: config.ssoWellKnown
        });
      });

      it('Should return Either with wellknown configuration in right side', () => {
        resultOrError
          .do({
            right: (wellknownResp: any) =>
              expectChai(wellknownResp)
                .to.be.an('object')
                .which.is.deep.equal(wellknown),
            left: (error: AppError) => assertChai
              .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
          });
      });
    });
  });
});
