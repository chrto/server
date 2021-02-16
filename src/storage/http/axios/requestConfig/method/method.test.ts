import setMethod from './method';
import { AxiosRequestConfig, Method } from 'axios';
import { expect as expectChai } from 'chai';
import { HTTP_METHOD } from '../../axios.types';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`method`, () => {
          const axiosRequestConfig: AxiosRequestConfig = {};
          const method: Method = HTTP_METHOD.GET;
          it('Should set method in to axios request configuration', () => {
            expectChai(setMethod(method)(axiosRequestConfig))
              .haveOwnProperty('method')
              .which.is.equal(method);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expectChai(setMethod(method)({ ...axiosRequestConfig, url }))
              .haveOwnProperty('url')
              .which.is.equal(url);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expectChai(setMethod(null)({ ...axiosRequestConfig, url }))
              .haveOwnProperty('url')
              .which.is.equal(url);
          });

          it(`Should not overwrite existing method`, () => {
            const url: string = 'https:example.com';
            expectChai(setMethod(null)({ ...axiosRequestConfig, url, method }))
              .haveOwnProperty('method')
              .which.is.equal(method);
          });
        });
      });
    });
  });
});
