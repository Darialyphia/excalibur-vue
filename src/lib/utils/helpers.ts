import { Defined, Nullable } from '@/lib/types';

export const stripUndefined = <T extends Record<string, any>>(obj: T) => {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key as keyof T] = value;
    }
  }

  return result;
};

export const isDefined = <T>(arg: Nullable<T>): arg is Defined<T> =>
  arg !== undefined && arg !== null;
