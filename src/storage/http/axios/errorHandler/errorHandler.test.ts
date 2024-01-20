import { Fcn } from 'common/types';
import { expect as expectChai } from 'chai';
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
          expectChai(result)
            .to.be.instanceOf(AppError);
          expectChai(result)
            .to.haveOwnProperty('code')
            .which.is.equal(errorResp.response.statusText);
          expectChai(result)
            .to.haveOwnProperty('message')
            .which.is.equal(errorResp.response.data.error_description);
        });

        it('Should log error', () => {
          expect(logError)
            .toBeCalled();
        });

        describe('Error types', () => {
          beforeEach(() => {
            jest.clearAllMocks();
          });

          it('Should return InvalidInput error, if status is set to 400', () => {
            expectChai(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 400 } }))
              .to.be.instanceOf(InvalidInput);
          });
          it('Should return NotAuthenticated error, if status is set to 401', () => {
            expectChai(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 401 } }))
              .to.be.instanceOf(NotAuthenticated);
          });
          it('Should return NotFound error, if status is set to 404', () => {
            expectChai(errorHandler({ ...errorResp, response: { ...errorResp.response, status: 404 } }))
              .to.be.instanceOf(NotFound);
          });
          it('Should return AppError error, if no response in error object', () => {
            expectChai(errorHandler({ ...errorResp, response: null }))
              .to.be.instanceOf(AppError);
          });
        });
      });
    });
  });
});
