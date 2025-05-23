import { AxiosRequestConfig } from 'axios';
import { HTTP_METHOD } from '../../axios.types';
import setUrl from './url';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`url`, () => {
          const axiosRequestConfig: AxiosRequestConfig = {};
          const url = 'http://example.com';
          it('Should set url in to axios request configuration', () => {
            expect(setUrl(url)(axiosRequestConfig))
              .toHaveProperty('url', url);
          });

          it(`Should not overwrite existing properties`, () => {
            expect(setUrl(url)({ ...axiosRequestConfig, method: HTTP_METHOD.GET }))
              .toHaveProperty('method', HTTP_METHOD.GET);
          });

          it(`Should not overwrite existing properties`, () => {
            expect(setUrl(null)({ ...axiosRequestConfig, method: HTTP_METHOD.GET }))
              .toHaveProperty('method', HTTP_METHOD.GET);
          });

          it(`Should not overwrite existing url`, () => {
            const url: string = 'https:example.com';
            expect(setUrl(null)({ ...axiosRequestConfig, url }))
              .toHaveProperty('url', url);
          });
        });
      });
    });
  });
});
