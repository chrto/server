import { AppError } from 'common/error';
import { Predicate } from 'common/types';
import { either, isEmpty, isNil } from 'ramda';
import { Either } from 'tsmonad';
import isEmail from 'validator/lib/isEmail';
import isIn from 'validator/lib/isIn';
import isInt from 'validator/lib/isInt';
import isUUID from 'validator/lib/isUUID';

export const isUuid = (value: string): boolean => isUUID(value);
export const isBoolean = (value: any): boolean => typeof value === 'boolean';
export const isUndefined = isNil;
export const isValidEmail = (value: string): boolean => isEmail(value);
export const isMissing = either(isNil, isEmpty);
export const trimmer = (item: string): string => item.trim();
export const isInteger = (value: string) => isInt(value);
export const isInArray = (array: string[]) =>
  (val: string) => !isMissing(val) && isIn(val, array);

export const isNotInArray = (array: string[]) =>
  (val: string) => !isInArray(array)(val);

export const andValidation = <T>(predicates: Predicate<T>[]) =>
  (obj: T): boolean =>
    predicates.reduce(
      (previous: boolean, predicate: Predicate<T>) => predicate(obj) && previous,
      true
    );

export const orValidation = <T>(predicates: Predicate<T>[]) =>
  (obj: T): boolean =>
    predicates.reduce(
      (previous: boolean, predicate: Predicate<T>) => predicate(obj) || previous,
      false
    );

export const checkOrReportInvalidInputError = <T>(check: boolean, appError: AppError) =>
  (val: T): Either<AppError, T> => check ? Either.right(val) : Either.left<AppError, T>(appError);

export const isType = (val: any, type: string): boolean => !isNil(val) && val.constructor && val.constructor.name.toLowerCase() === type.toLowerCase() ? true : false;
export const isString = (val: any): boolean => isType(val, 'string');
export const isNumber = (val: any): boolean => isType(val, 'number');
export const isObject = (val: any): boolean => isType(val, 'object');
export const isArray = (val: any): boolean => isType(val, 'array');
export const isEnum = (e: object) => (val: any): boolean => Object.values(e).includes(val);
export const isEnumCaseInsensitive = (e: object) => (val: any): boolean => Object.values(e).map(ev => isString(ev) ? ev.toLowerCase() : ev).includes(isString(val) ? val.toLowerCase() : val);
export const isRegExp = (regexp: RegExp) => (val: string): boolean => regexp.test(val);
export const hasProperty = (obj: object, prop: string): boolean => obj.hasOwnProperty(prop);

export const isSetTrue = (value: string): boolean => /^\s*(true|1)\s*$/.test(value);

export const validateField = <T, K extends keyof T>(obj: T, itemName: K, cb: (value: T[K]) => boolean): boolean => isUndefined(obj[itemName]) ? true : cb(obj[itemName]);
// export const validateEnum = <Enum>(obj: object, itemName: string, e: Enum): boolean => isUndefined(obj[itemName]) ? true : ;

const isSendOne = (obj: any, items: string[]): boolean => items.reduce((acc, item) => acc || !isMissing(obj[item]), false);
const areSendAll = (obj: any, items: string[]): boolean => items.reduce((acc, item) => acc && !isMissing(obj[item]), true);
export const areItemsTogether = (obj: any, items: string[]): boolean =>
  !isSendOne(obj, items)
    ? true
    : areSendAll(obj, items);
