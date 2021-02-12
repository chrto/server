import { AxiosRequestConfig, Method } from 'axios';
import { ParsedUrlQueryInput } from 'querystring';
import { HEADER_CONTENT_TYPE } from '../axios.types';

type AxiosRequestConfigFactory = (axiosRequestConfig: AxiosRequestConfig) => AxiosRequestConfig;

export interface RequestConfig {
  setBody: <RB extends ParsedUrlQueryInput> (body: RB, contentType?: HEADER_CONTENT_TYPE) => AxiosRequestConfigFactory;
  setHeader: <RH> (headers: RH) => AxiosRequestConfigFactory;
  setMethod: (method: Method) => AxiosRequestConfigFactory;
  setParams: <RP>(urlParams: RP) => AxiosRequestConfigFactory;
  setUrl: (url: string) => AxiosRequestConfigFactory;
}
