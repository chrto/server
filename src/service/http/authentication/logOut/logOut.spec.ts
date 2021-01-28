import { assert as assertChai, expect as expectChai } from 'chai';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

import logOutUnbound from './logOut';
import { TokenSet } from '../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`logOut`, () => {
      let instance: AxiosInstance = {} as AxiosInstance;
      const config: ISSOConfig = {
        ssoEndSessionEndpoint: 'http://end.session.endpoint.com'
      } as ISSOConfig;
      let result: Either<AppError, any>;

      beforeAll(async () => {
        instance.request = jest.fn().mockResolvedValue({
          data: null
        } as AxiosResponse<TokenSet>);

        result = await logOutUnbound
          .apply(null, [instance, config])
          .apply(null, ['id_token..']);
      });

      it('Should call axios request with exact AxiosRequestConfig', () => {
        expect(instance.request).toHaveBeenCalledWith({
          params: {
            'id_token_hint': 'id_token..'
          },
          headers: {
            'Accept': 'application/json'
          },
          method: 'get',
          url: config.ssoEndSessionEndpoint
        });
      });

      it('Should return Either with TokenSet model in right side', () => {
        result
          .do({
            right: (value: any) =>
              expectChai(value)
                .to.be.an('null'),
            left: (error: AppError) => assertChai
              .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
          });
      });
    });
  });
});
