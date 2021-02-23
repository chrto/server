import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <I extends any[], O> (f: (...args: I) => O) =>
  (...args: I): Either<AppError, O> => {
    try {
      return Either.right<AppError, O>(f(...args));
    } catch (error) {
      return Either.left<AppError, O>(
        error instanceof AppError
          ? error
          : new AppError(
            !error.code ? '' : error.code,
            !error.message ? 'unknown error' : error.message
          )
      );
    }
  };
