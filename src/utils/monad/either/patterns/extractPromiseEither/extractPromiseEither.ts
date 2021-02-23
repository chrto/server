import { AppError } from 'common/error';
import { Either, EitherPatterns } from 'tsmonad';

/**
 * For a right value extracts the promise from Either<Error, Promise<Either<Error, T>>> and returns it or
 * returns a new promise with the resolved error for a left value.
 */
export default <T> (): EitherPatterns<AppError, Promise<Either<AppError, T>>, Promise<Either<AppError, T>>> => ({
  right: (promise: Promise<Either<AppError, T>>): Promise<Either<AppError, T>> => promise,
  left: (error: AppError): Promise<Either<AppError, T>> => Promise.resolve(Either.left<AppError, T>(error))
});
