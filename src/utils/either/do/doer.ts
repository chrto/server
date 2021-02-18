import { AppError } from 'common/error';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { Doer } from '../either.types';

export default <T> (pattern: OptionalEitherPatterns<AppError, T, void>): Doer<T> =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError.do(pattern);
