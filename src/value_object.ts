import {TypeHolderDictionary, Restore} from "./type_indicator";

type ValueObject<T extends {[k: string]: any} = {[k: string]: any}> = Readonly<
  T
> & {
  /**
   * @returns plain object
   */
  toJSON(): T;
};

/** Constructor type of value object */
interface ValueObjectConstructor<T extends {[k: string]: any}> {
  new (initialValue: Readonly<T>): ValueObject<T>;
}

/** Type-function to restore data type from ValueObjectConstructor */
export type ValueType<
  T extends ValueObjectConstructor<any>
> = T extends ValueObjectConstructor<infer R> ? R : never;

const FORBIDDEN_PROP_NAMES: ReadonlyArray<string> = ["prototype", "__proto__"];

/**
 * @param config type definition of value object
 * @returns base class of value object
 */
export const valueObject = <T extends TypeHolderDictionary>(
  config: T,
): ValueObjectConstructor<Restore<T>> => {
  const predefinedKeys = Object.keys(config)
    .filter(e => FORBIDDEN_PROP_NAMES.indexOf(e) < 0)
    .sort();
  return class {
    constructor(arg: Restore<T>) {
      for (const k of predefinedKeys) {
        (this as any)[k] = (arg as any)[k];
      }
    }
    toJSON(): T {
      let obj: Partial<T> = {};
      for (const k of predefinedKeys) {
        obj[k] = (this as any)[k];
      }
      return obj as T;
    }
  } as any;
};
