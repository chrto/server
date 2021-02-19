import lift from 'utils/either/lift/lift';
import { asyncBind } from 'utils/either';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AuthGrantType, TokenRefreshReqData, TokenSet } from '../types';
import { AxiosStorageHandler, HEADERS, HEADER_ACCEPT, HEADER_CONTENT_TYPE } from 'storage/http/axios/axios.types';
import { TokenRefreshQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/refreshTokenSet/refreshTokenSet.types';
import { RequestConfig } from 'storage/http/axios/requestConfig/requestConfig.types';
import { Factory } from 'common/types';

export default (
  postRequest: AxiosStorageHandler<TokenSet>,
  { setBody, setHeader }: RequestConfig,
  sanitizeResponse: <T>(response: AxiosResponse<T>) => T,
  tokenSetFactory: Factory<TokenSet, TokenSetModel>
) =>
  (ssoConfig: ISSOConfig) =>
    ({ refresh_token }: TokenRefreshQueryParams): Promise<Either<AppError, TokenSetModel>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>({}))
        .then(lift(setBody<TokenRefreshReqData>({
          refresh_token,
          grant_type: AuthGrantType.REFRESH_TOKEN,
          client_id: ssoConfig.ssoClientId,
          client_secret: ssoConfig.ssoClientSecret
        }, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)))
        .then(lift(setHeader({
          [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED,
          [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
        })))
        .then(asyncBind(postRequest(ssoConfig.ssoTokenEndpoint)))
        .then(lift(sanitizeResponse))
        .then(lift(tokenSetFactory));
