export type Override<A, B> = Omit<A, keyof B> & B;
export type Nullable<T> = T | null | undefined;
export type Defined<T> = Exclude<T, undefined | null>;
