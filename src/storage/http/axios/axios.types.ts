import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export enum HTTP_METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export enum HEADERS {
  CONTENT_TYPE = 'Content-Type',
  ACCEPT = 'Accept',
  AUTHORIZATION = 'Authorization'
}

export enum HEADER_CONTENT_TYPE {
  APPL_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded',
  APPL_JSON = 'application/json'
}

export enum HEADER_ACCEPT {
  APPL_JSON = 'application/json'
}

export type AxiosStorageHandler<R = any> = (url: string) => (config: AxiosRequestConfig) => Promise<Either<AppError, AxiosResponse<R>>>;
export interface AxiosStorage {
  getRequest: AxiosStorageHandler;
  postRequest: AxiosStorageHandler;
  patchRequest: AxiosStorageHandler;
  putRequest: AxiosStorageHandler;
  deleteRequest: AxiosStorageHandler;
}
