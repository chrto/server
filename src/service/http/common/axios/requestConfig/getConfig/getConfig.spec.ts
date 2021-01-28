import setGetConfig from './getConfig';
import { expect as expectChai } from 'chai';
import { HEADERS, HEADER_ACCEPT, HTTP_METHOD } from '../../types';

describe(`service`, () => {
  describe(`authentication`, () => {
    describe(`get request config`, () => {
      const url: string = 'http://example.com';

      it('Should create exact AxiosRequestConfig', () => {
        expectChai(setGetConfig(url))
          .to.be.an('object')
          .which.is.deep.equal({
            url,
            method: HTTP_METHOD.GET,
            headers: {
              [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON
            }
          });
      });
    });
  });
});
