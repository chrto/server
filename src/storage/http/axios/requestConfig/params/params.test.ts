import setParams from './params';
import { AxiosRequestConfig } from 'axios';

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
            expect(setParams<object>(params)(axiosRequestConfig))
              .toHaveProperty('params', params);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expect(setParams<object>(params)({ ...axiosRequestConfig, url }))
              .toHaveProperty('url', url);
          });

          it(`Should not overwrite existing params`, () => {
            const extraParams: object = { orderBy: 'name' };
            expect(setParams<object>(extraParams)({ ...axiosRequestConfig, params }))
              .toHaveProperty('params', { ...params, ...extraParams });
          });

          it(`Should not overwrite existing params, if extra params is 'null'`, () => {
            const extraParams: object = null;
            expect(setParams<object>(extraParams)({ ...axiosRequestConfig, params }))
              .toHaveProperty('params', params);
          });

          it(`Should not create params item, if no params`, () => {
            expect(setParams<object>(null)(axiosRequestConfig))
              .not.toHaveProperty('params');
          });
        });
      });
    });
  });
});
