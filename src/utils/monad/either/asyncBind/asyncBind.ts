import extractPromiseEither from '../patterns/extractPromiseEither/extractPromiseEither';
import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import { Injector } from '../either.types';

export default <I, O> (f: (val: I) => Promise<Either<AppError, O>>): Injector<I, O> =>
  (valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
    valueOrError
      .lift(f)
      .caseOf(extractPromiseEither<O>());
