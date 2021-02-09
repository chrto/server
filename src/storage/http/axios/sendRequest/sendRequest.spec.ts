import { assert as assertChai, expect as expectChai } from 'chai';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';

import sendRequestUnbound from './sendRequest.unbound';
import { HTTP_METHOD } from '../types';

describe(`service`, () => {
  describe(`common axios`, () => {
    describe(`send request`, () => {
      let config: AxiosRequestConfig;
      let handleAxiosError: (error: AxiosError) => AppError;
      const errCode: string = 'errCode';
      const errMsg: string = 'errMessage';
      beforeAll(async () => {
        config = {
          url: 'http://example.com',
          method: HTTP_METHOD.GET
        };
        handleAxiosError = jest.fn().mockReturnValue(new AppError(errCode, errMsg));
      });

      describe('Happy path', () => {
        const data: string = 'result data..';
        let result: Either<AppError, string>;
        let instance: AxiosInstance = {} as AxiosInstance;
        beforeAll(async () => {
          instance.request = jest.fn().mockResolvedValue({
            data
          } as AxiosResponse<string>);
          result = await sendRequestUnbound
            .apply(null, [handleAxiosError])
            .apply(null, [instance])
            .apply(null, [config]);
        });
        it(`Should return either with exact string in right side`, () => {
          result.do({
            right: (value: string) =>
              expectChai(value)
                .to.haveOwnProperty('data')
                .which.is.an('string')
                .which.is.equal(data),
            left: (error: AppError) => assertChai
              .fail(null, null, 'Left side was not expected.' + '\n' + error.code + '\n' + error.message)
          });
        });
        it(`Should call 'instance.request' method with exact data`, () => {
          expect(instance.request)
            .toHaveBeenCalledWith(config);
        });
      });
      describe('Error path', () => {
        const errorResp: AxiosError = {
          response: {
            statusText: 'Some status text..',
            data: {
              error_description: 'Some error desc..'
            }
          } as AxiosResponse<any>
        } as AxiosError;

        let result: Either<AppError, string>;
        let instance: AxiosInstance = {} as AxiosInstance;
        beforeAll(async () => {
          instance.request = jest.fn().mockRejectedValue(errorResp);
          result = await sendRequestUnbound
            .apply(null, [handleAxiosError])
            .apply(null, [instance])
            .apply(null, [config]);
        });
        it(`Should return either with exact error in left side`, () => {
          result.do({
            right: () =>
              assertChai
                .fail(null, null, 'Right side was not expected.'),
            left: (error: AppError) => {
              expectChai(error)
                .to.be.instanceOf(AppError);
              expectChai(error)
                .to.haveOwnProperty('message')
                .which.is.equal(errMsg);
              expectChai(error)
                .to.haveOwnProperty('code')
                .which.is.equal(errCode);
            }
          });
        });
      });
    });
  });
});
