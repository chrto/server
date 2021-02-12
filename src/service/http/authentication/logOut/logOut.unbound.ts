import { asyncBind, lift } from 'utils/either';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AxiosStorageHandler, HEADERS, HEADER_ACCEPT } from 'storage/http/axios/axios.types';
import { RequestConfig } from 'storage/http/axios/requestConfig/requestConfig.types';

export default (
  getRequest: AxiosStorageHandler<any>,
  { setHeader, setParams }: RequestConfig,
  sanitizeResponse: <T>(response: AxiosResponse<T>) => T
) =>
  (ssoConfig: ISSOConfig) =>
    (idToken: string): Promise<Either<AppError, any>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>({}))
        .then(lift(setParams<any>({ id_token_hint: idToken })))
        .then(lift(setHeader({
          [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
        })))
        .then(asyncBind(getRequest(ssoConfig.ssoEndSessionEndpoint)))
        .then(lift(sanitizeResponse));
