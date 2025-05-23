import logOutUnbound from './logOut.unbound';
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
import { AxiosStorage } from 'storage/http/axios/axios.types';
import { AxiosErrorData } from 'storage/http/axios/errorHandler/model.types';

const ID_TOKEN: string = 'id_token..';
const CONFIG: ISSOConfig = {
  ssoTokenEndpoint: 'http://token.endpoint.com',
  ssoClientId: 'client_id..',
  ssoRedirectUri: 'redirect_uri..',
  ssoClientSecret: 'secret'
} as ISSOConfig;
const AXIOS_RESPONSE: AxiosResponse<any> = {
  data: {}
} as AxiosResponse<any>;
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
      describe(`log out`, () => {
        let axiosInstance: AxiosInstance = {} as AxiosInstance;
        let axiosStorage: AxiosStorage;
        let result: Either<AppError, any>;

        beforeAll(() => {
          appLogger.error = (_) => appLogger; // disable logger
          axiosStorage = axiosUnbound(axiosInstance);
        });

        describe(`Happy path`, () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockResolvedValue(AXIOS_RESPONSE);
            result = await logOutUnbound
              .apply(null, [axiosStorage.getRequest, requestConfig, sanitizeResponse])
              .apply(null, [CONFIG])
              .apply(null, [ID_TOKEN]);
          });

          it(`Should retsolved Either with right side, if everything passed well`, () => {
            result.do({
              right: (model: any): void => {
                expect(model).toBeObject;
                expect(model).toStrictEqual({});
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
        });

        describe(`Error path - axios request error`, () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockRejectedValue(ERROR_RESPONSE);
            result = await logOutUnbound
              .apply(null, [axiosStorage.postRequest, requestConfig, sanitizeResponse, tokenSetFactory])
              .apply(null, [CONFIG])
              .apply(null, [ID_TOKEN]);
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
