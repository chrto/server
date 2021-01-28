import { assert as assertChai, expect as expectChai } from 'chai';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { AppError } from 'common/error';

import getTokenSetUnbound from './getTokenSet';
import { TokenSet } from '../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`getTokenSet`, () => {
      let instance: AxiosInstance = {} as AxiosInstance;
      const config: ISSOConfig = {
        ssoTokenEndpoint: 'http://token.endpoint.com',
        ssoClientId: 'client_id..',
        ssoRedirectUri: 'redirect_uri..',
        ssoClientSecret: 'secret'
      } as ISSOConfig;
      let result: Either<AppError, TokenSetModel>;

      beforeAll(async () => {
        instance.request = jest.fn().mockResolvedValue({
          data: {
            token_type: 'Bearer',
            expires_in: 10,
            id_token: 'id_token',
            access_token: 'access_token',
            refresh_token: 'refresh_token'
          }
        } as AxiosResponse<TokenSet>);

        result = await getTokenSetUnbound
          .apply(null, [instance, config])
          .apply(null, [{ auth_code: 'auth_code' }]);
      });

      it('Should call axios request with exact AxiosRequestConfig', () => {
        expect(instance.request).toHaveBeenCalledWith({
          data: 'code=auth_code&grant_type=authorization_code&client_id=client_id..&redirect_uri=redirect_uri..&client_secret=secret',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          url: 'http://token.endpoint.com'
        });
      });

      it('Should return Either with TokenSet model in right side', () => {
        result
          .do({
            right: (tokenSet: TokenSetModel) =>
              expectChai(tokenSet)
                .to.be.an('object')
                .which.is.deep.equal({
                  token_type: 'Bearer',
                  expires_in: 10,
                  ext_expires_in: undefined,
                  id_token: 'id_token',
                  access_token: 'access_token',
                  refresh_token: 'refresh_token'
                }),
            left: (error: AppError) => assertChai
              .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
          });
      });
    });
  });
});
