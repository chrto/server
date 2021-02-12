import refreshTokensUnbound from './refreshTokens.unbound';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { AppError } from 'common/error';

import { AuthGrantType, TokenGetReqData, TokenRefreshReqData, TokenSet } from '../types';
import { HEADERS, HEADER_ACCEPT, HEADER_CONTENT_TYPE } from 'storage/http/axios/axios.types';
import { stringify } from 'querystring';
import { TokenRefreshQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/refreshTokenSet/refreshTokenSet.types';

type AsyncExecutor = jest.Mock<Promise<Either<AppError, AxiosResponse<TokenSet>>>, [AxiosRequestConfig]>;

const CONFIG: ISSOConfig = {
  ssoTokenEndpoint: 'http://token.endpoint.com',
  ssoClientId: 'client_id..',
  ssoRedirectUri: 'redirect_uri..',
  ssoClientSecret: 'secret'
} as ISSOConfig;
const REFRESH_TOKEN: TokenRefreshQueryParams = { refresh_token: 'refresh_token..' };
const AXIOS_RESPONSE: AxiosResponse<TokenSet> = {
  data: {
    token_type: 'Bearer',
    expires_in: 10,
    id_token: 'id_token',
    access_token: 'access_token',
    refresh_token: 'refresh_token'
  }
} as AxiosResponse<TokenSet>;

const REQ_HEADERS = {
  [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED,
  [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
};

const REQ_BODY: TokenRefreshReqData = {
  refresh_token: REFRESH_TOKEN.refresh_token,
  grant_type: AuthGrantType.REFRESH_TOKEN,
  client_id: CONFIG.ssoClientId,
  client_secret: CONFIG.ssoClientSecret
};

describe(`service`, () => {
  describe(`http`, () => {
    describe(`authentication`, () => {
      describe(`refresh token set`, () => {
        let requestExecutor: AsyncExecutor;
        let postRequest: jest.Mock<AsyncExecutor, [string]>;
        let setBody: jest.Mock<jest.Mock<AxiosRequestConfig, [AxiosRequestConfig]>, [TokenGetReqData]>;
        let setHeader: jest.Mock<jest.Mock<AxiosRequestConfig, [AxiosRequestConfig]>, [object]>;
        let sanitizeResponse: jest.Mock<TokenSet, [AxiosResponse<TokenSet>]>;
        let tokenSetFactory: jest.Mock<TokenSetModel, [TokenSet]>;

        beforeAll(async () => {
          requestExecutor = jest.fn().mockResolvedValue(Either.right<AppError, AxiosResponse<TokenSet>>(AXIOS_RESPONSE));
          postRequest = jest.fn().mockReturnValue(requestExecutor);
          setBody = jest.fn().mockImplementation((body: TokenGetReqData) =>
            (config: AxiosRequestConfig): AxiosRequestConfig => ({ ...config, data: stringify(body) }));
          setHeader = jest.fn().mockImplementation((headers: object) =>
            (config: AxiosRequestConfig): AxiosRequestConfig => ({ ...config, headers }));
          sanitizeResponse = jest.fn().mockImplementation((response: AxiosResponse<TokenSet>) => response.data);
          tokenSetFactory = jest.fn().mockReturnValue(AXIOS_RESPONSE.data);

          await refreshTokensUnbound
            .apply(null, [postRequest, { setBody, setHeader }, sanitizeResponse, tokenSetFactory])
            .apply(null, [CONFIG])
            .apply(null, [REFRESH_TOKEN]);
        });
        it('Should set body in to axios request configuration', () => {
          expect(setBody)
            .toHaveBeenCalledTimes(1);
          expect(setBody)
            .toHaveBeenCalledWith(REQ_BODY, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED);
        });

        it('Should set headers in to axios request configuration', () => {
          expect(setHeader)
            .toHaveBeenCalledTimes(1);
          expect(setHeader)
            .toHaveBeenCalledWith(REQ_HEADERS);
        });

        it(`Should call post request with exact parameters, after configuration has been setted`, () => {
          expect(postRequest)
            .toHaveBeenCalledTimes(1);
          expect(postRequest)
            .toHaveBeenCalledWith(CONFIG.ssoTokenEndpoint);

          expect(requestExecutor)
            .toHaveBeenCalledTimes(1);
          expect(requestExecutor)
            .toHaveBeenCalledWith({ headers: REQ_HEADERS, data: stringify(REQ_BODY) });

          expect(postRequest)
            .toHaveBeenCalledAfter(setBody);
          expect(postRequest)
            .toHaveBeenCalledAfter(setHeader);
        });

        it(`Should sanitize response, after request has been called`, () => {
          expect(sanitizeResponse)
            .toHaveBeenCalledTimes(1);
          expect(sanitizeResponse)
            .toHaveBeenCalledWith(AXIOS_RESPONSE);
          expect(sanitizeResponse)
            .toHaveBeenCalledAfter(postRequest);
        });

        it(`Should build TokenSet model, after response has been sanitized`, () => {
          expect(tokenSetFactory)
            .toHaveBeenCalledTimes(1);
          expect(tokenSetFactory)
            .toHaveBeenCalledWith(AXIOS_RESPONSE.data);
          expect(tokenSetFactory)
            .toHaveBeenCalledAfter(sanitizeResponse);
        });
      });
    });
  });
});
