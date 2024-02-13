import { Fcn } from 'common/types';
import { AxiosError, AxiosResponse } from 'axios';
import { AppError } from 'common/error';
import { InvalidInput, NotAuthenticated, NotFound } from 'common/httpErrors';

import errorHandlerUnbound from './errorHandler.unbound';
import { AxiosErrorData } from './model.types';

describe(`storage`, () => {
  describe(`http`, () => {
    describe(`axios`, () => {
      describe(`error handler`, () => {
        let logError: Fcn<[string], <E>(e: E) => E>;
        let errorHandler: Fcn<[AxiosError], AppError>;
        let result: AppError;

        const errorResp: AxiosError<AxiosErrorData, any> = {
          response: {
            statusText: 'status',
            status: 500,
            data: {
              error_description: 'Some error desc..'
            }
          } as AxiosResponse<any>
        } as AxiosError;

        beforeAll(() => {
          logError = jest.fn().mockImplementation((_message: string) => <E> (e: E): E => e);
          errorHandler = errorHandlerUnbound
            .apply(null, [logError]);
          result = errorHandler(errorResp);
        });

        it('Should return AppError', () => {
          expect(result).toBeInstanceOf(AppError);
          expect(result).toHaveProperty('code', errorResp.response.statusText);
          expect(result).toHaveProperty('message', errorResp.response.data.error_description);
        });

        it('Should log error', () => {
          expect(logError).toHaveBeenCalled();
        });

        describe('Error types', () => {
          beforeEach(() => {
            jest.clearAllMocks();
          });

          it('Should return InvalidInput error, if status is set to 400', () => {
            expect(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 400 } })).toBeInstanceOf(InvalidInput);
          });
          it('Should return NotAuthenticated error, if status is set to 401', () => {
            expect(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 401 } })).toBeInstanceOf(NotAuthenticated);
          });
          it('Should return NotFound error, if status is set to 404', () => {
            expect(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 404 } })).toBeInstanceOf(NotFound);
          });
          it('Should return AppError error, if no response in error object', () => {
            expect(errorHandler({ ...errorResp, response: null })).toBeInstanceOf(AppError);
          });
        });
      });
    });
  });
});
