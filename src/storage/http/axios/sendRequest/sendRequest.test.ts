import sendRequest from './sendRequest';
import logger from 'utils/logger';
import { expect as expectChai } from 'chai';
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { InvalidInput } from 'common/httpErrors';

const CONFIG: AxiosRequestConfig = {
  data: {},
  headers: {}
};

let ERROR_RESPONSE: AxiosError = {
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
          logger.error = (_) => logger; // disable logger
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
                expectChai(value)
                  .to.haveOwnProperty('data')
                  .which.is.an({}.constructor.name)
                  .which.is.equal(AXIOS_RESPONSE.data);
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
                expectChai(error)
                  .to.be.instanceOf(InvalidInput);
                expectChai(error)
                  .to.haveOwnProperty('message')
                  .which.is.equal(ERROR_RESPONSE.response.data.error_description);
                expectChai(error)
                  .to.haveOwnProperty('code')
                  .which.is.equal('invalid.input');
              }
            });
          });
        });
      });
    });
  });
});
