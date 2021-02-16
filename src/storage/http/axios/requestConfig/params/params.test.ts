import setParams from './params';
import { AxiosRequestConfig } from 'axios';
import { expect as expectChai } from 'chai';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`params`, () => {
          const params: object = {
            order: 'desc'
          };
          const axiosRequestConfig: AxiosRequestConfig = {};
          it('Should set specific url params in to axios request configuration', () => {
            expectChai(setParams<object>(params)(axiosRequestConfig))
              .haveOwnProperty('params')
              .which.is.deep.equal(params);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expectChai(setParams<object>(params)({ ...axiosRequestConfig, url }))
              .haveOwnProperty('url')
              .which.is.equal(url);
          });

          it(`Should not overwrite existing params`, () => {
            const extraParams: object = { orderBy: 'name' };
            expectChai(setParams<object>(extraParams)({ ...axiosRequestConfig, params }))
              .haveOwnProperty('params')
              .which.is.deep.equal({ ...params, ...extraParams });
          });

          it(`Should not overwrite existing params, if extra params is 'null'`, () => {
            const extraParams: object = null;
            expectChai(setParams<object>(extraParams)({ ...axiosRequestConfig, params }))
              .haveOwnProperty('params')
              .which.is.deep.equal(params);
          });

          it(`Should not create params item, if no params`, () => {
            expectChai(setParams<object>(null)(axiosRequestConfig))
              .not.haveOwnProperty('params');
          });
        });
      });
    });
  });
});
