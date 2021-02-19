import { AppError } from 'common/error';
import { Predicate } from 'common/types';
import { Either, EitherPatterns } from 'tsmonad';
import asyncLift from './either/asyncLift/asyncLift';

/**
 * Only use for Eithers where there is no possible Left value,
 * because it returns null for a Left value (so that it type-checks)
 */
export const takeRight = <T> (): EitherPatterns<AppError, T, T> => ({
  right: v => v,
  left: () => null
});

export const either = <T> (val: T, appError: AppError): Either<AppError, T> =>
  typeof val !== 'undefined' && val !== null ? Either.right(val) : Either.left(appError);

export const valueOrError =
  <T> (e: AppError) =>
    (v: T): Either<AppError, T> =>
      v !== undefined && v !== null ? Either.right(v) : Either.left(e);

export const ignoreResult = <T> (action: () => Either<AppError, any>) =>
  (prevResult: Either<AppError, T>): Either<AppError, T> => action().bind(() => prevResult);

export const asyncCaseOf = <R, T> (pattern: EitherPatterns<AppError, R, Promise<T>>) =>
  (valueOrError: Either<AppError, R>): Promise<T> =>
    valueOrError.caseOf(pattern);

export const makeSure = <T> (predicate: Predicate<T>, error: AppError) =>
  (val: T): Either<AppError, T> =>
    predicate(val) ?
      Either.right(val) :
      Either.left(error);

export const asyncIgnoreResult = <T> (action: (val: T) => Promise<any>) =>
  (prevResult: Either<AppError, T>): Promise<Either<AppError, T>> =>
    Promise
      .resolve(
        prevResult
      )
      .then(
        asyncLift(res => action(res).then(() => res).catch(() => res))
      );

export const bindAll = (eithers: Either<any, any>[]): Either<any, any[]> =>
  eithers.reduce((prevsOrError, currOrError) =>
    prevsOrError.bind(prevs => currOrError.lift(curr => [...prevs, curr]))
    , Either.right([])
  );

export const tap = <T> (f: (val: T) => void) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .do({ right: f });

export const ftap = <T> (f: (val: T) => Either<AppError, void>) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .bind(f)
      .caseOf({
        right: (): Either<AppError, T> => valueOrError,
        left: (error: AppError): Either<AppError, T> => Either.left(error)
      });

export const tapLeft = <T> (f: (error: AppError) => void) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .do({ left: f });

export const forError = <T> (f: (err: AppError) => AppError) =>
  (input: Either<AppError, T>): Either<AppError, T> =>
    input
      .caseOf({
        right: value => Either.right(value),
        left: err => Either.left(f(err))
      });
