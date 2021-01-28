import { AxiosRequestConfig } from 'axios';
import { expect as expectChai } from 'chai';
import { HTTP_METHOD } from '../../../types';
import setUrl from './url';

describe(`service`, () => {
  describe(`common axios`, () => {
    describe(`config`, () => {
      describe(`url`, () => {
        const axiosRequestConfig: AxiosRequestConfig = {};
        const url = 'http://example.com';
        it('Should set url in to axios request configuration', () => {
          expectChai(setUrl(url)(axiosRequestConfig))
            .haveOwnProperty('url')
            .which.is.equal(url);
        });

        it(`Should not overwrite existing properties`, () => {
          expectChai(setUrl(url)({ ...axiosRequestConfig, method: HTTP_METHOD.GET }))
            .haveOwnProperty('method')
            .which.is.equal(HTTP_METHOD.GET);
        });

        it(`Should not overwrite existing properties`, () => {
          expectChai(setUrl(null)({ ...axiosRequestConfig, method: HTTP_METHOD.GET }))
            .haveOwnProperty('method')
            .which.is.equal(HTTP_METHOD.GET);
        });

        it(`Should not overwrite existing url`, () => {
          const url: string = 'https:example.com';
          expectChai(setUrl(null)({ ...axiosRequestConfig, url }))
            .haveOwnProperty('url')
            .which.is.equal(url);
        });
      });
    });
  });
});
