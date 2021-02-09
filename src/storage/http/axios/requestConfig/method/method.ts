import { AxiosRequestConfig, Method } from 'axios';
import { isMissing } from 'utils/validation';

export default (method: Method) =>
  (axiosRequestConfig: AxiosRequestConfig): AxiosRequestConfig =>
    isMissing(method)
      ? axiosRequestConfig
      : { ...axiosRequestConfig, method };
