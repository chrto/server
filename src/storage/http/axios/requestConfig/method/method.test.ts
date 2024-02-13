import setMethod from './method';
import { AxiosRequestConfig, Method } from 'axios';
import { HTTP_METHOD } from '../../axios.types';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`method`, () => {
          const axiosRequestConfig: AxiosRequestConfig = {};
          const method: Method = HTTP_METHOD.GET;
          it('Should set method in to axios request configuration', () => {
            expect(setMethod(method)(axiosRequestConfig)).toHaveProperty('method', method);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expect(setMethod(method)({ ...axiosRequestConfig, url })).toHaveProperty('url', url);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expect(setMethod(null)({ ...axiosRequestConfig, url })).toHaveProperty('url', url);
          });

          it(`Should not overwrite existing method`, () => {
            const url: string = 'https:example.com';
            expect(setMethod(null)({ ...axiosRequestConfig, url, method })).toHaveProperty('method', method);
          });
        });
      });
    });
  });
});
