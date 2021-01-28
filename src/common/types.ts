export type Fcn<T extends unknown[], R = unknown> = (...args: T) => R;
export type Predicate<T> = (input: T) => boolean;
export type PromiseConst<T> = (resolve: (value?: T) => void, reject?: (reason: any) => void) => void;
export type Mandatory<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : (T[P] | undefined);
}

export interface Factory<I, O> {
  (params: I): O;
}
