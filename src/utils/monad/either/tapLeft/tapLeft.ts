import { AppError } from 'common/error';
import { Either } from 'tsmonad';

export default <T> (f: (error: AppError) => void) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .do({ left: f });
