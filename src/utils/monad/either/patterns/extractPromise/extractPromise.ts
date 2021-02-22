import { valueOrError } from 'utils/either';
import { InvalidInput } from 'common/httpErrors';
import { Either, EitherPatterns } from 'tsmonad';
import { AppError } from 'common/error';

/**
 * For a right value extracts the promise from Either<Error, Promise<T>> and returns it with Either or
 * returns a new promise with the resolved error for a left value.
 */
export default <T> (): EitherPatterns<AppError, Promise<T>, Promise<Either<AppError, T>>> => ({
  right: (valPromise: Promise<T>): Promise<Either<AppError, T>> =>
    valPromise.then(valueOrError(new InvalidInput(`Got null value`))),
  left: (error: AppError): Promise<Either<AppError, T>> => Promise.resolve(Either.left<AppError, T>(error))
});
