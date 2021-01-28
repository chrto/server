import middleware from './authenticationErrorHandler';
import { NextFunction } from 'express';
import { NotAuthenticated } from 'common/httpErrors';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`middlewares`, () => {
      describe(`authentication error handler`, () => {
        let nextFcn: NextFunction;

        beforeAll(() => {
          nextFcn = jest.fn().mockReturnValue(null);
        });

        beforeEach(() => {
          jest.clearAllMocks();
        });

        it(`Shoud shift error, if error code is not equal to 401`, () => {
          const error: any = { status: 500 };
          middleware(error, null, null, nextFcn);
          expect(nextFcn)
            .toHaveBeenCalledWith(error);
        });

        it(`Shoud shift 'NotAuthenticated' error, if error code is not equal to 401`, () => {
          const error: any = { status: 401, message: 'Not Authenticated' };
          const expected: NotAuthenticated = new NotAuthenticated(error.message);
          middleware(error, null, null, nextFcn);
          expect(nextFcn)
            .toHaveBeenCalledWith(expected);
        });
      });
    });
  });
});
