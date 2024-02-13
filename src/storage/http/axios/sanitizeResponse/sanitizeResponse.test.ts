import { AxiosResponse } from 'axios';

import sanitizeResponse from './sanitizeResponse';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`sanitize response`, () => {
        it('happy path', () => {
          const data: number = 10;
          const mockResponse: AxiosResponse<number> = { data } as AxiosResponse<number>;
          const result: number = sanitizeResponse(mockResponse);
          expect(result).toBe('number');
          expect(result).toBe(data);
        });
      });
    });
  });
});
