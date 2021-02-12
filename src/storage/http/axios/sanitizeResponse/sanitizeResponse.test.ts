import { AxiosResponse } from 'axios';
import { expect as expectChai } from 'chai';

import sanitizeResponse from './sanitizeResponse';

describe(`service`, () => {
  describe(`common axios`, () => {
    describe(`sanitize response`, () => {
      it('happy path', () => {
        const data: number = 10;
        const mockResponse: AxiosResponse<number> = { data } as AxiosResponse<number>;
        expectChai(sanitizeResponse(mockResponse))
          .to.be.an('number')
          .which.is.equal(data);
      });
    });
  });
});
