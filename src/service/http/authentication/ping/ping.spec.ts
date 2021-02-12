import pingUnbound from './ping.unbound';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AppError } from 'common/error';
import { HEADERS, HEADER_ACCEPT } from 'storage/http/axios/axios.types';

type AsyncExecutor = jest.Mock<Promise<Either<AppError, AxiosResponse<any>>>, [AxiosRequestConfig]>;

const CONFIG: ISSOConfig = {
  ssoTokenEndpoint: 'http://token.endpoint.com',
  ssoWellKnown: 'http://well.known.endpoint.com',
  ssoClientId: 'client_id..',
  ssoRedirectUri: 'redirect_uri..',
  ssoClientSecret: 'secret'
} as ISSOConfig;
const AXIOS_RESPONSE: AxiosResponse<any> = {
  data: {}
} as AxiosResponse<any>;

const REQ_HEADERS = {
  [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
};

describe(`service`, () => {
  describe(`http`, () => {
    describe(`authentication`, () => {
      describe(`log out`, () => {
        let requestExecutor: AsyncExecutor;
        let getRequest: jest.Mock<AsyncExecutor, [string]>;
        let setHeader: jest.Mock<jest.Mock<AxiosRequestConfig, [AxiosRequestConfig]>, [object]>;
        let sanitizeResponse: jest.Mock<any, [AxiosResponse<any>]>;

        beforeAll(async () => {
          requestExecutor = jest.fn().mockResolvedValue(Either.right<AppError, AxiosResponse<any>>(AXIOS_RESPONSE));
          getRequest = jest.fn().mockReturnValue(requestExecutor);
          setHeader = jest.fn().mockImplementation((headers: object) =>
            (config: AxiosRequestConfig): AxiosRequestConfig => ({ ...config, headers }));
          sanitizeResponse = jest.fn().mockImplementation((response: AxiosResponse<any>) => response.data);

          await pingUnbound
            .apply(null, [getRequest, { setHeader }, sanitizeResponse])
            .apply(null, [CONFIG])
            .apply(null, []);
        });

        it('Should set headers in to axios request configuration', () => {
          expect(setHeader)
            .toHaveBeenCalledTimes(1);
          expect(setHeader)
            .toHaveBeenCalledWith(REQ_HEADERS);
        });

        it(`Should call get request with exact parameters, after configuration has been setted`, () => {
          expect(getRequest)
            .toHaveBeenCalledTimes(1);
          expect(getRequest)
            .toHaveBeenCalledWith(CONFIG.ssoWellKnown);

          expect(requestExecutor)
            .toHaveBeenCalledTimes(1);
          expect(requestExecutor)
            .toHaveBeenCalledWith({ headers: REQ_HEADERS });

          expect(getRequest)
            .toHaveBeenCalledAfter(setHeader);
        });

        it(`Should sanitize response, after request has been called`, () => {
          expect(sanitizeResponse)
            .toHaveBeenCalledTimes(1);
          expect(sanitizeResponse)
            .toHaveBeenCalledWith(AXIOS_RESPONSE);
          expect(sanitizeResponse)
            .toHaveBeenCalledAfter(getRequest);
        });
      });
    });
  });
});
