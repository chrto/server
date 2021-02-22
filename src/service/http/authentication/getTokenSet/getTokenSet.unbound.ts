import lift from 'utils/either/lift/lift';
import asyncBind from 'utils/either/asyncBind/asyncBind';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { TokenQueryParams } from 'web/serverModules/modules/authentication/controllers/authentication/getTokenSet/getTokenSet.types';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AuthGrantType, TokenGetReqData, TokenSet } from '../types';
import { AxiosStorageHandler, HEADERS, HEADER_ACCEPT, HEADER_CONTENT_TYPE } from 'storage/http/axios/axios.types';
import { TokenSet as TokenSetModel } from 'model/authentication/tokenSet.types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestConfig } from 'storage/http/axios/requestConfig/requestConfig.types';
import { Factory } from 'common/types';

export default (
  postRequest: AxiosStorageHandler<TokenSet>,
  { setBody, setHeader }: RequestConfig,
  sanitizeResponse: <T>(response: AxiosResponse<T>) => T,
  tokenSetFactory: Factory<TokenSet, TokenSetModel>
) =>
  (ssoConfig: ISSOConfig) =>
    ({ auth_code }: TokenQueryParams): Promise<Either<AppError, TokenSetModel>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>({}))
        .then(lift(setBody<TokenGetReqData>({
          code: auth_code,
          grant_type: AuthGrantType.AUTHORIZATON_CODE,
          client_id: ssoConfig.ssoClientId,
          redirect_uri: ssoConfig.ssoRedirectUri,
          client_secret: ssoConfig.ssoClientSecret
        }, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)))
        .then(lift(setHeader({
          [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED,
          [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
        })))
        .then(asyncBind(postRequest(ssoConfig.ssoTokenEndpoint)))
        .then(lift(sanitizeResponse))
        .then(lift(tokenSetFactory));
