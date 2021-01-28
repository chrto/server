import setTokenConfig from './postConfig';
import { expect as expectChai } from 'chai';
import { HEADERS, HEADER_ACCEPT, HEADER_CONTENT_TYPE, HTTP_METHOD } from '../../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`post request config`, () => {
      const url: string = 'http://example.com';
      it('Should create exact AxiosRequestConfig', () => {
        expectChai(setTokenConfig(url))
          .to.be.an('object')
          .which.is.deep.equal({
            url,
            method: HTTP_METHOD.POST,
            headers: {
              [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED,
              [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
            }
          });
      });
    });
  });
});
