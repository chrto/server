import { AppError } from 'common/error';
import { InvalidInput } from 'common/httpErrors';
import { Fcn, Predicate } from 'common/types';
import { Either } from 'tsmonad';
import { ObjectValidatorError } from '../objectValidator.types';

const getObjectItems = <T>(obj: T): string[] => Object.getOwnPropertyNames(obj);
const getMissingItems = (requiredFields: string[], pred: Fcn<[string[]], Predicate<string>>) =>
  (items: string[]): string[] =>
    requiredFields.filter(pred(items));

export default (isNotInArray: Fcn<[string[]], Fcn<[string], boolean>>) =>
  (requiredFields: string[], errorClass: ObjectValidatorError = InvalidInput) =>
    <T extends object>(obj: T): Either<AppError, T> =>
      Either.right<AppError, T>(obj)
        .lift(getObjectItems)
        .lift(getMissingItems(requiredFields, isNotInArray))
        .bind((missingRequired: string[]) =>
          missingRequired.length === 0
            ? Either.right<AppError, T>(obj)
            : Either.left<AppError, T>(new errorClass(`following required properties are missing in request: ${missingRequired.join(', ')}`))
        );
