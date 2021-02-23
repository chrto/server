import { AppError } from 'common/error';
import { Either } from 'tsmonad';
import asyncLift from './monad/either/asyncLift/asyncLift';

export const either = <T> (val: T, appError: AppError): Either<AppError, T> =>
  typeof val !== 'undefined' && val !== null ? Either.right(val) : Either.left(appError);

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

export const tapLeft = <T> (f: (error: AppError) => void) =>
  (valueOrError: Either<AppError, T>): Either<AppError, T> =>
    valueOrError
      .do({ left: f });
