import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import handleErrorUnbound from './handleError.unbound';

const ERROR_MESSAGE: string = 'error message..';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`param handler helpers`, () => {
      describe(`add entity in to request implicits`, () => {
        let next: jest.Mock<void, []>;
        let isMissing: jest.Mock<boolean, [any]>;
        let handleError: (e: AppError) => void;
        beforeAll(() => {
          next = jest.fn().mockReturnValue(null);
          isMissing = jest.fn().mockReturnValue(false);

          handleError = handleErrorUnbound
            .apply(null, [isMissing])
            .apply(null, [null, null, next, ERROR_MESSAGE]);
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        it(`Should check, if error is instance of 'NotFound'`, () => {
          const error: AppError = new AppError('', '');
          handleError(error);
          expect(isMissing)
            .toHaveBeenCalledTimes(0);
        });

        it(`Should check, if error message has been specified`, () => {
          const error: AppError = new NotFound('');
          handleError(error);
          expect(isMissing)
            .toHaveBeenCalledTimes(1);
        });

        it(`Should pass error in to next middleware`, () => {
          const error: AppError = new AppError('', '');
          handleError(error);
          expect(next)
            .toHaveBeenCalledTimes(1);
          expect(next)
            .toHaveBeenCalledWith(error);
        });
      });
    });
  });
});
