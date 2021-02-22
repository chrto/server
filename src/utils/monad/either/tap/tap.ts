import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (f: (val: T) => void) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .do({ right: f });
