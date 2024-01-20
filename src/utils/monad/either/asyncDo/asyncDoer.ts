import { AppError } from 'common/error';
import { Either, OptionalEitherPatterns } from 'tsmonad';
import { isMissing } from 'utils/validation';
import { AsyncDoer } from '../either.types';

export default <T> (pattern: OptionalEitherPatterns<AppError, T, Promise<void>>): AsyncDoer<T> =>
  (valueOrError: Either<AppError, T>): Promise<Either<AppError, T>> =>
    valueOrError
      .caseOf({
        right: !isMissing(pattern.right) ? pattern.right : (_v) => Promise.resolve(null),
        left: !isMissing(pattern.left) ? pattern.left : (_e) => Promise.resolve(null)
      })
      .then(() => valueOrError);
