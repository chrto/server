import { Factory } from 'common/types';

export const pickProperties = <I, O>(properties: string[]): Factory<I, Partial<O>> =>
  (original: I): Partial<O> => {
  return properties.reduce( (acc: O, val: string, _index: number ): O => {
    const trimVal: string = val.trim();
    if (original.hasOwnProperty(trimVal)) {
      acc[trimVal] = original[trimVal];
    }
    return acc;
  }, {});
};
