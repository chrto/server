import { AppError } from 'common/error';
import { NotFound } from 'common/httpErrors';
import { isMissing } from 'utils/validation';
import handleErrorUnbound from './handleError.unbound';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`param handler helpers`, () => {
      describe(`add entity in to request implicits`, () => {
        let next: jest.Mock<void, []>;
        let handleError: (e: AppError) => void;
        beforeAll(() => {
          next = jest.fn().mockReturnValue(null);

          handleError = handleErrorUnbound
            .apply(null, [isMissing])
            .bind(null, null, null, next);
        });

        it(`Should pass error in to next middleware, if error is not instance of 'NotFound`, () => {
          const error: AppError = new AppError('', '');
          handleError.apply(null, [])(error);
          expect(next)
            .toHaveBeenCalledWith(error);
        });

        it(`Should pass error in to next middleware, if error is instance of 'NotFound, but no custom message has been specified`, () => {
          const error: NotFound = new NotFound('entity not found');
          handleError.apply(null, [])(error);
          expect(next)
            .toHaveBeenCalledWith(error);
        });

        it(`Should pass exact 'NotFound' error in to next middleware, if error is instance of 'NotFound, and custom message has been specified`, () => {
          const ERROR_MESSAGE: string = 'error message..';
          const error: NotFound = new NotFound('entity not found');
          handleError.apply(null, [ERROR_MESSAGE])(error);
          expect(next)
            .toHaveBeenCalledWith(new NotFound(ERROR_MESSAGE));
        });
      });
    });
  });
});
