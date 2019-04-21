import {Restore, TypeHolder} from "./type_indicator";

/** Forbidden keys of value object */
const FORBIDDEN_KEYS = ["__proto__", "toJSON", "equals"] as const;

type ValueObject<T extends {[k: string]: any}> = Readonly<T> & {
  /**
   * @returns plain object
   */
  toJSON(): T;
  /**
   * @param {T} other comparee
   * @returns {boolean} The results of shallow comparing
   */
  equals(other: T): boolean;
};

/** Constructor type of value object */
type ValueObjectConstructor<T extends {[k: string]: any}> = {
  /**
   * @param initalValue The initializing value of this value object
   */
  new (initalValue: Readonly<T>): ValueObject<T>;
};

export type ValueObjectTypeDefinition = Readonly<{
  [k: string]: TypeHolder<any>;
}> &
  {[P in typeof FORBIDDEN_KEYS[0]]?: never};

/** Type-function to restore data type from ValueObjectConstructor */
export type ValueType<
  T extends ValueObjectConstructor<any>
> = T extends ValueObjectConstructor<infer R> ? R : never;

/**
 * @param typedef type definition of value object
 * @returns base class of value object
 */
export const valueObject = <T extends ValueObjectTypeDefinition>(
  typedef: T,
): ValueObjectConstructor<Restore<T>> => {
  const predefinedKeys = Object.keys(typedef).filter(
    e => (FORBIDDEN_KEYS as ReadonlyArray<string>).indexOf(e) < 0,
  );
  return class {
    constructor(arg: Restore<T>) {
      for (const k of predefinedKeys) {
        Object.defineProperty(this, k, {
          value: (arg as any)[k],
          enumerable: true,
          writable: false,
        });
      }
    }

    toJSON(): T {
      let obj: Partial<T> = {};
      for (const k of predefinedKeys) {
        obj[k] = (this as any)[k];
      }
      return obj as T;
    }

    equals(other: Restore<T>): boolean {
      const keys = Object.keys(other);
      for (const k of keys) {
        if (predefinedKeys.indexOf(k) < 0) {
          return false;
        }
        if ((this as any)[k] !== (other as any)[k]) {
          return false;
        }
      }
      return true;
    }
  } as any;
};
