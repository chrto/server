import { Fcn } from 'common/types';
import isInArray from '../../isIn/array/isInArray';

const sameLength = <T>(array1: T[], array2: T[]): boolean => array1.length === array2.length;

export default <T>(array1: T[], array2: T[]): boolean =>
  [sameLength, isInArray]
    .reduce(
      (acc: boolean, check: Fcn<[T[], T[]], boolean>): boolean => check(array1, array2) && acc,
      true
    );
