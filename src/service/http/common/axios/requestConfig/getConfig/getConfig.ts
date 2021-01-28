import { AxiosRequestConfig } from 'axios';
import setUrl from '../configItems/url/url';
import setMethod from '../configItems/method/method';
import setHeader from '../configItems/headers/header';
import { pipe } from 'ramda';
import { HEADERS, HEADER_ACCEPT, HTTP_METHOD } from '../../types';

export default (url: string): AxiosRequestConfig =>
  pipe(
    setUrl(url),
    setMethod(HTTP_METHOD.GET),
    setHeader<object>({
      [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
    })
  )
    .apply(null, {});
