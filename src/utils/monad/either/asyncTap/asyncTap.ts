import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { AsyncDoer } from '../either.types';

export default <T> (f: (v: T) => Promise<void>): AsyncDoer<T> =>
  (valueOrError: Either<AppError, T>): Promise<Either<AppError, T>> =>
    valueOrError
      .caseOf({
        right: f,
        left: (_e: AppError) => Promise.resolve(null)
      })
      .then(() => valueOrError);
