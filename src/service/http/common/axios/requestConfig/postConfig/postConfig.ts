import setUrl from '../configItems/url/url';
import setMethod from '../configItems/method/method';
import setHeader from '../configItems/headers/header';
import { pipe } from 'ramda';
import { AxiosRequestConfig } from 'axios';
import { HEADERS, HEADER_ACCEPT, HEADER_CONTENT_TYPE, HTTP_METHOD } from '../../types';

export default (url: string): AxiosRequestConfig =>
  pipe(
    setUrl(url),
    setMethod(HTTP_METHOD.POST),
    setHeader<object>({
      [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED,
      [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
    })
  )
    .apply(null, [{}]);
