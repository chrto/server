import compareStringEqual, { SensitivityOptions } from 'utils/compare/string/compareStrings';
import { isMissing, isString } from 'utils/validation';

export default <E, FQ extends object>(query: FQ) =>
  (entities: E[]): E[] =>
    entities.filter((entity: E): boolean =>
      Object.keys(query)
        .every(queryStringFilter(entity, query))
    );

const queryStringFilter = <E, FQ extends object>(entity: E, query: FQ) =>
  (key: string): boolean =>
    isMissing(query[key]) || isMissing(entity[key])
      ? true
      : isString(query[key])
        ? compareStringEqual(entity[key], query[key], SensitivityOptions.base)
        : entity[key] === query[key];
