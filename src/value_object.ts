import {ObjectTypeIndicator, Restore} from "./type_indicator";

type ValueObject<T extends {[k: string]: any} = {[k: string]: any}>
  = Readonly<T>
  & {
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
export type ValueType<T extends ValueObjectConstructor<any>>
  = T extends ValueObjectConstructor<infer R> ? R : never;

const FORBIDDEN_PROP_NAMES: ReadonlyArray<string> = [
  "prototype",
  "__proto__",
];

/**
 * @param objectTypeIndicator type indicator of value object
 * @returns base class of value object
 */
export const valueObject = <T extends ObjectTypeIndicator>(
  objectTypeIndicator: T,
): ValueObjectConstructor<Restore<T>> => {
  const keys = Object.keys(objectTypeIndicator)
    .filter(e => FORBIDDEN_PROP_NAMES.indexOf(e) < 0);
  return class {
    constructor(arg: Restore<T>) {
      for (const k of keys) {
        (this as any)[k] = (arg as any)[k];
      }
    }
    toJSON() {
      let obj: Partial<{[k: string]: any}> = {};
      for (const k of keys) {
        obj[k] = (this as any)[k];
      }
      return obj;
    }
  } as any;
};
