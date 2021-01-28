import { AxiosRequestConfig } from 'axios';
import { isMissing } from 'utils/validation';

export default (url: string) =>
  (axiosRequestConfig: AxiosRequestConfig): AxiosRequestConfig =>
    isMissing(url)
      ? axiosRequestConfig
      : { ...axiosRequestConfig, url };
