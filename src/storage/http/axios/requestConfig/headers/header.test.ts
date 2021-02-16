import { AxiosRequestConfig } from 'axios';
import { expect as expectChai } from 'chai';

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
            expectChai(setHeader<object>(headers)(axiosRequestConfig))
              .haveOwnProperty('headers')
              .which.is.deep.equal(headers);
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expectChai(setHeader<object>(headers)({ ...axiosRequestConfig, url }))
              .haveOwnProperty('url')
              .which.is.equal(url);
          });

          it(`Should not overwrite existing headers`, () => {
            const extraHeaders: object = { [HEADERS.CONTENT_TYPE]: HEADER_CONTENT_TYPE.APPL_JSON };
            expectChai(setHeader<object>(extraHeaders)({ ...axiosRequestConfig, headers }).headers)
              .haveOwnProperty(HEADERS.ACCEPT)
              .which.is.equal(HEADER_ACCEPT.APPL_JSON);
          });

          it(`Should not overwrite existing headers, if extra headers is 'null'`, () => {
            const extraHeaders: object = null;
            expectChai(setHeader<object>(extraHeaders)({ ...axiosRequestConfig, headers }))
              .haveOwnProperty('headers')
              .which.is.deep.equal(headers);
          });

          it(`Should not create headers item, if no headers`, () => {
            expectChai(setHeader<object>(null)(axiosRequestConfig))
              .not.haveOwnProperty('headers');
          });
        });
      });
    });
  });
});
