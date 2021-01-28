import middlewareUnbounded from './errorHandler.unbound';
import { AppError } from 'common/error';
import { Fcn } from 'common/types';
import { Logger } from 'winston';
import { NextFunction, Request, Response } from 'express';
import { Conflict, InvalidInput, NotAuthenticated, NotAuthorized, NotFound } from 'common/httpErrors';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`error handler`, () => {
        let logger: Logger = {} as Logger;
        let response: Response<any> = {} as Response<any>;
        let middleware: Fcn<[any, Request, Response, NextFunction], void>;

        beforeAll(() => {
          logger.error = jest.fn().mockImplementation((_message: string): Logger => logger);
          response.status = jest.fn().mockImplementation((_code: number): Response<any> => response);
          response.send = jest.fn().mockImplementation((_obj: any): Response<any> => response);
          middleware = middlewareUnbounded.apply(null, [logger]);
        });

        beforeEach(() => {
          jest.clearAllMocks();
        });

        it(`Should response with code 500, if error is not instance of 'AppError'`, () => {
          const error: any = { code: 'code', message: 'message' };
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenLastCalledWith(error);
          expect(response.status)
            .toHaveBeenCalledWith(500);
          expect(response.send)
            .toHaveBeenCalledWith({ message: 'error', details: 'Internal Server Error' });
        });

        it(`Should response with code 403, if error is instance of 'NotAuthorized'`, () => {
          const error: NotAuthorized = new NotAuthorized('not authorized');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- not authorized`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(403);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });

        it(`Should response with code 401, if error is instance of 'NotAuthenticated'`, () => {
          const error: NotAuthenticated = new NotAuthenticated('not auth');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- not authenticated`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(401);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });

        it(`Should response with code 404, if error is instance of 'NotFound'`, () => {
          const error: NotFound = new NotFound('not found');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- not found`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(404);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });

        it(`Should response with code 409, if error is instance of 'Conflict'`, () => {
          const error: Conflict = new Conflict('not found');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- resource update conflict`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(409);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });

        it(`Should response with code 400, if error is instance of 'InvalidInput'`, () => {
          const error: InvalidInput = new InvalidInput('not found');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- invalid input`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(400);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });

        it(`Should response with code 500 otherwise`, () => {
          const error: AppError = new AppError('error', 'Internal Server Error');
          middleware(error, null, response, null);
          expect(logger.error)
            .toHaveBeenCalledTimes(2);
          expect(logger.error)
            .toHaveBeenNthCalledWith(1, `- unhandled error type: code = ${error.code} - returning status 500`);
          expect(logger.error)
            .toHaveBeenNthCalledWith(2, `- reason: ${error.message}`);
          expect(response.status)
            .toHaveBeenCalledWith(500);
          expect(response.send)
            .toHaveBeenCalledWith({ message: error.code, details: error.message });
        });
      });
    });
  });
});
