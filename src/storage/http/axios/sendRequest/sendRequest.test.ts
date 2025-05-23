import sendRequest from './sendRequest';
import appLogger from 'logger/appLogger';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InvalidInput } from 'common/httpErrors';
import { AxiosErrorData } from '../errorHandler/model.types';

const CONFIG: AxiosRequestConfig = {
  data: {},
  headers: {}
};

let ERROR_RESPONSE: AxiosError<AxiosErrorData, any> = {
  response: {
    statusText: 'status',
    status: 400,
    data: {
      error_description: 'Some error desc..'
    }
  } as AxiosResponse<any>
} as AxiosError;

const AXIOS_RESPONSE: AxiosResponse<any> = {
  data: {}
} as AxiosResponse<any>;

const METHOD: Method = 'POST';
const URL: string = 'http://ep.com/api/user';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`send request`, () => {
        let axiosInstance: AxiosInstance = {} as AxiosInstance;
        let result: Either<AppError, any>;

        beforeAll(() => {
          appLogger.error = (_) => appLogger; // disable logger
        });
        describe('Happy path', () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockResolvedValue(AXIOS_RESPONSE);
            result = await sendRequest
              .apply(null, [axiosInstance])
              .apply(null, [METHOD, URL])
              .apply(null, [CONFIG]);
          });
          it(`Should return either with exact data in right side, if everything passed well`, () => {
            result.do({
              right: (value: any): void => {
                expect(value).toHaveProperty('data');
                expect(value.data).toBeObject;
                expect(value.data).toBe(AXIOS_RESPONSE.data);
              },
              left: (error: AppError) => fail(`Left side has not been expected: ${error.message}`)
            });
          });
          it(`Should send request with exact config`, () => {
            expect(axiosInstance.request)
              .toHaveBeenCalledTimes(1);
            expect(axiosInstance.request)
              .toHaveBeenCalledWith({
                ...CONFIG,
                url: URL,
                method: METHOD
              });
          });
        });

        describe('Error path', () => {
          beforeAll(async () => {
            axiosInstance.request = jest.fn().mockRejectedValue(ERROR_RESPONSE);
            result = await sendRequest
              .apply(null, [axiosInstance])
              .apply(null, [METHOD, URL])
              .apply(null, [CONFIG]);
          });

          it(`Should return either with exact error in left side`, () => {
            result.do({
              right: (): void => fail(`Right side has not been expected`),
              left: (error: AppError) => {
                expect(error).toBeInstanceOf(InvalidInput);
                expect(error.message).toBe(ERROR_RESPONSE.response.data.error_description);
                expect(error.code).toBe('invalid.input');
              }
            });
          });
        });
      });
    });
  });
});
