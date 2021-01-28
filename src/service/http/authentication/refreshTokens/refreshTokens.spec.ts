import { assert as assertChai, expect as expectChai } from 'chai';
import { AxiosInstance, AxiosResponse } from 'axios';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';

import refreshTokensUnbound from './refreshTokens';
import { TokenSet } from '../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`refreshTokens`, () => {
      let instance: AxiosInstance = {} as AxiosInstance;
      const config: ISSOConfig = {
        ssoTokenEndpoint: 'http://token.endpoint.com',
        ssoClientId: 'client_id..',
        ssoClientSecret: 'secret'
      } as ISSOConfig;
      let result: Either<AppError, TokenSetModel>;

      beforeAll(async () => {
        instance.request = jest.fn().mockResolvedValue({
          data: {
            token_type: 'bearer',
            expires_in: 300,
            id_token: 'id_token',
            access_token: 'access_token',
            refresh_token: 'refresh_token'
          }
        } as AxiosResponse<TokenSet>);

        result = await refreshTokensUnbound
          .apply(null, [instance, config])
          .apply(null, [{ refresh_token: 'refresh_token' }]);
      });

      it('Should call axios request with exact AxiosRequestConfig', () => {
        expect(instance.request).toHaveBeenCalledWith({
          data: 'refresh_token=refresh_token&grant_type=refresh_token&client_id=client_id..&client_secret=secret',
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
                  token_type: 'bearer',
                  expires_in: 300,
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
