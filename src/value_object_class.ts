/**
 * Forbidden keys of value object
 */
const FORBIDDEN_KEYS = ["__proto__"] as const;

type ForbiddenKeys = typeof FORBIDDEN_KEYS[number];

type ForbidKeys<K extends string> = {readonly [_ in K]?: never};

type SafeObject = Readonly<Record<string, any>> & ForbidKeys<ForbiddenKeys>;

/**
 * Value object base class interface
 * @template T Value object data type
 */
type ValueObject<T extends SafeObject> = Readonly<T>;

/**
 * Constructor type of value object
 * @template T Value object props type
 */
type ValueObjectConstructor<T extends SafeObject> = {
  new (props: Readonly<T>): ValueObject<T>;
};

/**
 * @template T Value object props type
 */
type ReturnOfValueObjectClassFn<T extends SafeObject> = {
  /**
   * @param keys property keys to filter
   * @return Base class of a value object
   */
  keys: <K extends keyof T>(
    keys: readonly K[],
  ) => ValueObjectConstructor<{[FK in K]: T[FK]}>;
};

/**
 * @example
 * ```typescript
 * import {valueObjectClass} from "valueobject.ts";
 *
 * type PersonProps = {
 *   name: string,
 *   age: number,
 * };
 *
 * const personKeys = ["name", "age"] as const;
 *
 * class Person extends valueObjectClass<PersonProps>().keys(personKeys) {
 *   greet(): string {
 *     return `Hello, I am ${this.name}.`;
 *   }
 *   growOne(): Person {
 *     return new Person({...this, age: this.age + 1});
 *   }
 * }
 * ```
 */
export const valueObjectClass = <
  T extends SafeObject
>(): ReturnOfValueObjectClassFn<T> => ({
  keys: <K extends keyof T>(keys: readonly K[]) => {
    const permittedKeys = keys.filter(k => !FORBIDDEN_KEYS.includes(k as any));

    return class BaseClass {
      constructor(props: T) {
        Object.keys(props).forEach((key: keyof T) => {
          if (permittedKeys.includes(key as any)) {
            (this as any)[key] = props[key];
          }
        });
      }
    } as ValueObjectConstructor<{[FK in K]: T[FK]}>;
  },
});
