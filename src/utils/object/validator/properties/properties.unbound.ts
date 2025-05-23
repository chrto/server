import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { Fcn, Predicate } from 'common/types';
import { Either } from 'tsmonad';
import { ObjectValidatorError } from '../objectValidator.types';
import { pipe } from 'ramda';
import { Validator } from './properties.types';

export const check = <T>(constraint: Predicate<T>, msg: string | string[] | ((input: T) => string | string[])): Validator<T> =>
  (obj: T, prevResult: string[]): string[] =>
    pipe(
      (msg): string | string[] => typeof msg === 'function' ? msg(obj) : msg,
      (msgOrArray: string | string[]) =>
        constraint(obj)
          ? prevResult
          : msgOrArray instanceof Array
            ? [...prevResult, ...msgOrArray]
            : [...prevResult, msgOrArray]
    )(msg);

const errorCollector = <T>(paramChecks: Validator<T>[]) =>
  (input: T): string[] =>
    paramChecks.reduce((errors: string[], paramCheck: Validator<T>) => paramCheck(input, errors), []);

const validateWith = <T>(isMissing: Predicate<string[]>) =>
  (errorCollector: (input: T) => string[]) =>
    (errorClass: ObjectValidatorError) =>
      (input: T): Either<AppError, T> =>
        pipe(
          errorCollector,
          (errors: string[]): Either<AppError, T> =>
            isMissing(errors) ?
              Either.right(input) :
              Either.left(new errorClass(`Validation failed: ${JSON.stringify(errors)}`))
        )(input);

export default (isMissing: Predicate<string[]>) =>
  <T>(paramChecks: Validator<T>[], errorClass: ObjectValidatorError = InvalidInput): Fcn<[T], Either<AppError, T>> =>
    pipe(
      errorCollector,
      validateWith<T>(isMissing),
      (validator: Fcn<[ObjectValidatorError], Fcn<[T], Either<AppError, T>>>) => validator(errorClass)
    )(paramChecks);
