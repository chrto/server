import getTokenSetUnbound from './getTokenSet.unbound';
import axiosUnbound from 'storage/http/axios/axios.unbound';
import appLogger from 'logger/appLogger';
import requestConfig from 'storage/http/axios/requestConfig/requestConfig';
import sanitizeResponse from 'storage/http/axios/sanitizeResponse/sanitizeResponse';
import tokenSetFactory from 'model/authentication/tokenSet';
import { InvalidInput } from 'common/httpErrors';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { TokenSet } from '../types';
import { TokenQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/getTokenSet/getTokenSet.types';
import { AxiosStorage } from 'storage/http/axios/axios.types';
import { AxiosErrorData } from 'storage/http/axios/errorHandler/model.types';

const CONFIG: ISSOConfig = {
  ssoTokenEndpoint: 'http://token.endpoint.com',
  ssoClientId: 'client_id..',
  ssoRedirectUri: 'redirect_uri..',
  ssoClientSecret: 'secret'
} as ISSOConfig;
const AUTH_CODE: TokenQueryParams = { auth_code: 'auth_code..' };
const AXIOS_RESPONSE: AxiosResponse<TokenSet> = {
  data: {
    token_type: 'Bearer',
    expires_in: 10,
    id_token: 'id_token',
    access_token: 'access_token',
    refresh_token: 'refresh_token'
  }
} as AxiosResponse<TokenSet>;
let ERROR_RESPONSE: AxiosError<AxiosErrorData, any> = {
  response: {
    statusText: 'status',
    status: 400,
    data: {
      error_description: 'Some error desc..'
    }
  } as AxiosResponse<any>
} as AxiosError;

describe(`service`, () => {
  describe(`http`, () => {
    describe(`authentication`, () => {
      describe(`get token set`, () => {
        let axiosInstance: AxiosInstance = {} as AxiosInstance;
        let axiosStorage: AxiosStorage;
        let result: Either<AppError, TokenSetModel>;

        beforeAll(() => {
          appLogger.error = (_) => appLogger; // disable logger
          axiosStorage = axiosUnbound(axiosInstance);
        });

        describe(`Happy path`, () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockResolvedValue(AXIOS_RESPONSE);
            result = await getTokenSetUnbound
              .apply(null, [axiosStorage.postRequest, requestConfig, sanitizeResponse, tokenSetFactory])
              .apply(null, [CONFIG])
              .apply(null, [AUTH_CODE]);
          });

          it(`Should retsolved Either with TokenSet model in right side, if everything passed well`, () => {
            result.do({
              right: (tokenSet: TokenSetModel): void => {
                expect(tokenSet).toBeObject;
                expect(tokenSet).toStrictEqual(tokenSetFactory(AXIOS_RESPONSE.data));
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Error path - axios request error`, () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockRejectedValue(ERROR_RESPONSE);
            result = await getTokenSetUnbound
              .apply(null, [axiosStorage.postRequest, requestConfig, sanitizeResponse, tokenSetFactory])
              .apply(null, [CONFIG])
              .apply(null, [AUTH_CODE]);
          });

          it(`Should resolved Either whit exact AppError in left side, if an error has been thorwn`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error).toBeInstanceOf(InvalidInput);
                expect(error.message).toEqual(ERROR_RESPONSE.response.data.error_description);
              }
            });
          });
        });
      });
    });
  });
});
