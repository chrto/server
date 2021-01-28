import setBody from './body';
import { AxiosRequestConfig } from 'axios';
import { expect as expectChai } from 'chai';
import { ParsedUrlQueryInput, stringify } from 'querystring';
import { HEADER_CONTENT_TYPE } from '../../../types';

describe(`service`, () => {
  describe(`common axios`, () => {
    describe(`config`, () => {
      describe(`body`, () => {
        const body: ParsedUrlQueryInput = {
          name: 'Jon Doe',
          role: 'admin'
        };
        const axiosRequestConfig: AxiosRequestConfig = {};

        it(`Should set specific body in to axios request configuration. ContentType is set to 'application/json' by default.`, () => {
          expectChai(setBody<ParsedUrlQueryInput>(body)(axiosRequestConfig))
            .haveOwnProperty('data')
            .which.is.deep.equal(body);
        });

        it(`Should set specific body as 'application/x-www-form-urlencoded' in to axios request configuration`, () => {
          expectChai(setBody<ParsedUrlQueryInput>(body, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)(axiosRequestConfig))
            .haveOwnProperty('data')
            .which.is.equal(stringify(body as any));
        });

        it(`Should not overwrite existing properties`, () => {
          const url: string = 'https:example.com';
          expectChai(setBody<ParsedUrlQueryInput>(body)({ ...axiosRequestConfig, url }))
            .haveOwnProperty('url')
            .which.is.equal(url);
        });

        it(`Should not overwrite existing body (application/json)`, () => {
          const extraBody: ParsedUrlQueryInput = { email: 'jon.doe@company.com' };
          expectChai(setBody<ParsedUrlQueryInput>(extraBody)({ ...axiosRequestConfig, data: body }))
            .haveOwnProperty('data')
            .which.is.deep.equal({ ...body, ...extraBody });
        });

        it(`Should not overwrite existing body (application/x-www-form-urlencoded)`, () => {
          const extraBody: ParsedUrlQueryInput = {
            email: 'jon.doe@company.com',
            org: 'company'
          };
          expectChai(setBody<ParsedUrlQueryInput>(extraBody, HEADER_CONTENT_TYPE.APPL_X_WWW_FORM_URLENCODED)({ ...axiosRequestConfig, data: stringify(body as any) }))
            .haveOwnProperty('data')
            .which.is.deep.equal(stringify({ ...body, ...extraBody }));
        });

        it(`Should not overwrite existing body, if extra body is 'null'`, () => {
          const extraBody: ParsedUrlQueryInput = null;
          expectChai(setBody<ParsedUrlQueryInput>(extraBody)({ ...axiosRequestConfig, data: body }))
            .haveOwnProperty('data')
            .which.is.deep.equal(body);
        });

        it(`Should not create data item, if no body`, () => {
          expectChai(setBody<ParsedUrlQueryInput>(null)(axiosRequestConfig))
            .not.haveOwnProperty('data');
        });
      });
    });
  });
});
