import { AxiosRequestConfig } from 'axios';

import setHeader from './header';
import { HEADER_ACCEPT, HEADER_CONTENT_TYPE, HEADERS } from '../../axios.types';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`header`, () => {
          const axiosRequestConfig: AxiosRequestConfig = {};
          const headers: object = { [HEADERS.ACCEPT]: HEADER_ACCEPT.APPL_JSON };
          it('Should set specific header in to axios request configuration', () => {
            expect(setHeader<object>(headers)(axiosRequestConfig)).toHaveProperty('headers', headers);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expect(setHeader<object>(headers)({ ...axiosRequestConfig, url })).toHaveProperty('url', url);
          });

          it(`Should not overwrite existing headers`, () => {
            const extraHeaders: object = { [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_JSON };
            expect(setHeader<object>(extraHeaders)({ ...axiosRequestConfig, headers }).headers)
              .toHaveProperty(HEADERS.ACCEPT, HEADER_ACCEPT.APPL_JSON);
          });

          it(`Should not overwrite existing headers, if extra headers is 'null'`, () => {
            const extraHeaders: object = null;
            expect(setHeader<object>(extraHeaders)({ ...axiosRequestConfig, headers }).headers)
              .toHaveProperty(HEADERS.ACCEPT, HEADER_ACCEPT.APPL_JSON);
          });

          it(`Should not create headers item, if no headers`, () => {
            expect(setHeader<object>(null)(axiosRequestConfig))
              .not.toHaveProperty('headers');
          });
        });
      });
    });
  });
});
