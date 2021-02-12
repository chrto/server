import { AxiosRequestConfig } from 'axios';
import { isMissing } from 'utils/validation';

export default <RH> (headers: RH) =>
  (axiosRequestConfig: AxiosRequestConfig): AxiosRequestConfig =>
    isMissing(headers)
      ? axiosRequestConfig
      : {
        ...axiosRequestConfig,
        headers: {
          ...axiosRequestConfig.headers,
          ...headers
        }
      };
