import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Either } from 'tsmonad';
import { AppError } from 'common/error';
import { AxiosStorage, HTTP_METHOD } from './axios.types';

import { asyncBind } from 'utils/either';
import sendRequest from './sendRequest/sendRequest';

export default (axiosInstance: AxiosInstance): AxiosStorage => ({
  getRequest: <R> (url: string) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<R>>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
        .then(asyncBind(sendRequest<R>(axiosInstance)(HTTP_METHOD.GET, url))),
  postRequest: <R> (url: string) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<R>>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
        .then(asyncBind(sendRequest<R>(axiosInstance)(HTTP_METHOD.POST, url))),
  patchRequest: <R> (url: string) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<R>>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
        .then(asyncBind(sendRequest<R>(axiosInstance)(HTTP_METHOD.PATCH, url))),
  putRequest: <R> (url: string) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<R>>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
        .then(asyncBind(sendRequest<R>(axiosInstance)(HTTP_METHOD.PUT, url))),
  deleteRequest: <R> (url: string) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<R>>> =>
      Promise.resolve(Either.right<AppError, AxiosRequestConfig>(config))
        .then(asyncBind(sendRequest<R>(axiosInstance)(HTTP_METHOD.DELETE, url)))
});
