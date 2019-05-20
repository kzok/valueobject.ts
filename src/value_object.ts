import {Restore, TypeHolder} from "./type_holder";

/**
 * Base class of ValueObject (For type restriction)
 */
class BaseClass<_ extends {[k: string]: any}> {
  private readonly _tag!: "valueobject.ts - BaseClass";
}

/**
 * Forbidden keys of value object
 */
const FORBIDDEN_KEYS = ["__proto__", "toJSON", "equals"] as const;

/**
 * Value object base class interface
 * @template T Value object data type
 */
type ValueObject<T extends {[k: string]: any}> = Readonly<T> &
  BaseClass<T> & {
    /**
     * @returns plain object
     */
    toJSON(): T;
    /**
     * @param other argument to compare
     * @returns The results of shallow comparison
     */
    equals(other: Readonly<T>): boolean;
  };

/**
 * Constructor type of value object
 * @template T Value object data type
 */
type ValueObjectConstructor<T extends {[k: string]: any}> = {
  /**
   * @param initalValue The initializing value of this value object
   */
  new (initalValue: Readonly<T>): ValueObject<T>;
};

/**
 * Type-function to restore data type from ValueObject
 * @template T Value object class type or instance type
 */
export type ValueType<
  T extends ValueObject<any> | (new (..._: any[]) => ValueObject<any>)
> = T extends ValueObject<infer R>
  ? R
  : T extends new (..._: any[]) => ValueObject<infer R>
  ? R
  : never;

/**
 * Type-definition of ValueObject data type
 */
export type ValueObjectTypeDefinition = Readonly<{
  [k: string]: TypeHolder<any>;
}> &
  {[P in typeof FORBIDDEN_KEYS[number]]?: never};

/**
 * @param typedef type definition of value object
 * @returns base class of value object
 *
 * @example
 * ```typescript
 * import {valueObject, type, ValueType} from "valueobject.ts";
 *
 * class Person extends valueObject({
 *     name: type.string,
 *     age: type.number,
 * }) {
 *     greet(): string {
 *         return `Hello, I am ${this.name}.`;
 *     }
 *     growOne(): Person {
 *         return new Person({...this, age: this.age + 1});
 *     }
 * }
 * ```
 */
export const valueObject = <T extends ValueObjectTypeDefinition>(
  typedef: T,
): ValueObjectConstructor<Restore<T>> => {
  const predefinedKeys = Object.keys(typedef).filter(
    e => (FORBIDDEN_KEYS as readonly string[]).indexOf(e) < 0,
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
