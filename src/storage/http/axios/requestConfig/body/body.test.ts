import setBody from './body';
import { AxiosRequestConfig } from 'axios';
import { ParsedUrlQueryInput, stringify } from 'querystring';
import { HEADER_CONTENT_TYPE } from '../../axios.types';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`config`, () => {
        describe(`body`, () => {
          const body: ParsedUrlQueryInput = {
            name: 'Jon Doe',
            role: 'admin'
          };
          const axiosRequestConfig: AxiosRequestConfig = {};

          it(`Should set specific body in to axios request configuration. ContentType is set to 'application/json' by default.`, () => {
            expect(setBody<ParsedUrlQueryInput>(body)(axiosRequestConfig))
              .toHaveProperty('data', body);
          });

          it(`Should set specific body as 'application/x-www-form-urlencoded' in to axios request configuration`, () => {
            expect(setBody<ParsedUrlQueryInput>(body, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)(axiosRequestConfig))
              .toHaveProperty('data', stringify(body as any));
          });

          it(`Should not overwrite existing properties`, () => {
            const url: string = 'https:example.com';
            expect(setBody<ParsedUrlQueryInput>(body)({ ...axiosRequestConfig, url }))
              .toHaveProperty('url', url);
          });

          it(`Should not overwrite existing body (application/json)`, () => {
            const extraBody: ParsedUrlQueryInput = { email: 'jon.doe@company.com' };
            expect(setBody<ParsedUrlQueryInput>(extraBody)({ ...axiosRequestConfig, data: body }))
              .toHaveProperty('data', { ...body, ...extraBody });
          });

          it(`Should not overwrite existing body (application/x-www-form-urlencoded)`, () => {
            const extraBody: ParsedUrlQueryInput = {
              email: 'jon.doe@company.com',
              org: 'company'
            };
            expect(setBody<ParsedUrlQueryInput>(extraBody, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)({ ...axiosRequestConfig, data: stringify(body as any) }))
              .toHaveProperty('data', stringify({ ...body, ...extraBody }));
          });

          it(`Should not overwrite existing body, if extra body is 'null'`, () => {
            const extraBody: ParsedUrlQueryInput = null;
            expect(setBody<ParsedUrlQueryInput>(extraBody)({ ...axiosRequestConfig, data: body }))
              .toHaveProperty('data', body);
          });

          it(`Should not create data item, if no body`, () => {
            expect(setBody<ParsedUrlQueryInput>(null)(axiosRequestConfig))
              .not.toHaveProperty('data');
          });
        });
      });
    });
  });
});
