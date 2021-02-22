import lift from 'utils/monad/either/lift/lift';
import asyncBind from 'utils/monad/either/asyncBind/asyncBind';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';
import { AxiosStorageHandler, HEADERS, HEADER_ACCEPT } from 'storage/http/axios/axios.types';
import { RequestConfig } from 'storage/http/axios/requestConfig/requestConfig.types';

export default (
  getRequest: AxiosStorageHandler<any>,
  { setHeader }: RequestConfig,
  sanitizeResponse: <T>(response: AxiosResponse<T>) => T
) =>
  (ssoConfig: ISSOConfig) =>
    (): Promise<Either<AppError, any>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>({}))
        .then(lift(setHeader({
          [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
        })))
        .then(asyncBind(getRequest(ssoConfig.ssoWellKnown)))
        .then(lift(sanitizeResponse));
