import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { Predicate } from 'common/types';
import { Either, EitherPatterns } from 'tsmonad';

/**
 * Only use for Eithers where there is no possible Left value,
 * because it returns null for a Left value (so that it type-checks)
 */
export const takeRight = <T> (): EitherPatterns<AppError, T, T> => ({
  right: v => v,
  left: () => null
});

/**
 * For a right value extracts the promise from Either<Error, Promise<Either<Error, T>>> and returns it or
 * returns a new promise with the resolved error for a left value.
 */
const extractPromise = <T> (): EitherPatterns<AppError, Promise<Either<AppError, T>>, Promise<Either<AppError, T>>> => ({
  right: (promise: Promise<Either<AppError, T>>): Promise<Either<AppError, T>> => promise,
  left: (error: AppError): Promise<Either<AppError, T>> => Promise.resolve(Either.left<AppError, T>(error))
});

export const asyncStep = <I, O> (f: (val: I) => Promise<Either<AppError, O>>, valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
  valueOrError
    .lift(f)
    .caseOf(extractPromise());

type Injector<I, O> = (input: Either<AppError, I>) => Promise<Either<AppError, O>>;

type Binder<I, O> = (input: Either<AppError, I>) => Either<AppError, O>;

type Lifter<I, O> = (input: Either<AppError, I>) => Either<AppError, O>;

export const either = <T> (val: T, appError: AppError): Either<AppError, T> =>
  typeof val !== 'undefined' && val !== null ? Either.right(val) : Either.left(appError);

export const valueOrError =
  <T> (e: AppError) =>
    (v: T): Either<AppError, T> =>
      v !== null ? Either.right(v) : Either.left(e);

export const bind = <I, O> (f: (val: I) => Either<AppError, O>): Binder<I, O> =>
  (valueOrError: Either<AppError, I>): Either<AppError, O> =>
    valueOrError.bind(f);

export const asyncBind = <I, O> (f: (val: I) => Promise<Either<AppError, O>>): Injector<I, O> =>
  (valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
    valueOrError
      .lift(f)
      .caseOf(extractPromise());

export const lift = <I, O> (f: (val: I) => O): Lifter<I, O> =>
  (valueOrError: Either<AppError, I>): Either<AppError, O> =>
    valueOrError.lift(f);

export const asyncLift = <I, O> (f: (val: I) => Promise<O>): Injector<I, O> =>
  (valueOrError: Either<AppError, I>): Promise<Either<AppError, O>> =>
    valueOrError
      .lift(f)
      .caseOf({
        right: (valPromise: Promise<O>): Promise<Either<AppError, O>> => valPromise.then(val => either(val, new InvalidInput(`Got null value`))),
        left: (error: AppError): Promise<Either<AppError, O>> => Promise.resolve(Either.left(error))
      });

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
