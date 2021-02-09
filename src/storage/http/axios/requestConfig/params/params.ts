import { AxiosRequestConfig } from 'axios';
import { isMissing } from 'utils/validation';

export default <RP>(urlParams: RP) =>
  (axiosRequestConfig: AxiosRequestConfig): AxiosRequestConfig =>
    isMissing(urlParams)
      ? axiosRequestConfig
      : {
        ...axiosRequestConfig,
        params: {
          ...axiosRequestConfig.params,
          ...urlParams
        }
      };
