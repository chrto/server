import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Either } from 'tsmonad';

export default (handleAxiosError: Fcn<[AxiosError], AppError>) =>
  <T>(axiosInstance: AxiosInstance) =>
    (config: AxiosRequestConfig): Promise<Either<AppError, AxiosResponse<T>>> =>
      axiosInstance.request<T>(config)
        .then(Either.right)
        .catch((error: AxiosError) => Either.left(handleAxiosError(error)));
