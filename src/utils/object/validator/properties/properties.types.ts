export type Validator<T> = (obj: T, prevResult: string[]) => string[];
