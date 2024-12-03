import { Defined, Nullable } from '@/types';

export const isDefined = <T>(arg: Nullable<T>): arg is Defined<T> =>
  arg !== undefined && arg !== null;
