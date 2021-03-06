import lift from 'utils/monad/either/lift/lift';
import asyncLift from 'utils/monad/either/asyncLift/asyncLift';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';

export default (
  handleAxiosError: Fcn<[AxiosError], AppError>,
  setMethod: Fcn<[Method], Fcn<[AxiosRequestConfig], AxiosRequestConfig>>,
  setUrl: Fcn<[string], Fcn<[AxiosRequestConfig], AxiosRequestConfig>>
) =>
  <T> (axiosInstance: AxiosInstance) =>
    (method: Method, url: string) =>
      (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<T>>> =>
        Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
          .then(lift(setMethod(method)))
          .then(lift(setUrl(url)))
          .then(asyncLift(axiosInstance.request))
          .catch((error: AxiosError) => Either.left(handleAxiosError(error)));
