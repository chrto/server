import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (f: (err: AppError) => AppError) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .caseOf({
        right: value => Either.right(value),
        left: err => Either.left(f(err))
      });
