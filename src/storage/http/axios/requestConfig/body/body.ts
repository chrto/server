import { AxiosRequestConfig } from 'axios';
import { parse, ParsedUrlQueryInput, stringify } from 'querystring';
import { isMissing } from 'utils/validation';
import { HEADER_CONTENT_TYPE } from '../../axios.types';

export default <RB extends ParsedUrlQueryInput>(body: RB, contentType: HEADER_CONTENT_TYPE = HEADER_CONTENT_TYPE.APPL_JSON) =>
  (axiosRequestConfig: AxiosRequestConfig): AxiosRequestConfig =>
    isMissing(body)
      ? axiosRequestConfig
      : {
        ...axiosRequestConfig,
        data: contentType === HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED
          ? isMissing(axiosRequestConfig.data)
            ? stringify(body)
            : stringify({
              ...parse(axiosRequestConfig.data),
              ...body
            })
          : {
            ...axiosRequestConfig.data,
            ...body
          }
      };
