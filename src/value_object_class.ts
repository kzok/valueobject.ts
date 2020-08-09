/**
 * Forbidden keys of value object
 */
const FORBIDDEN_KEYS = ["__proto__"] as const;

type ForbiddenKeys = typeof FORBIDDEN_KEYS[number];

type ForbidKeys<K extends string> = {readonly [_ in K]?: never};

type SafeObject = Readonly<Record<string, any>> & ForbidKeys<ForbiddenKeys>;

declare const ___tag: unique symbol;

/**
 * Nominal class type
 */
class Nominalizer<T extends SafeObject> {
  private readonly [___tag]: T;
}

/**
 * Value object base class interface
 * @template T Value object data type
 */
type ValueObject<T extends SafeObject> = Readonly<T> & Nominalizer<T>;

/**
 * Constructor type of value object
 * @template T Value object props type
 */
type ValueObjectConstructor<T extends SafeObject> = {
  new (props: Readonly<T>): ValueObject<T>;
};

/**
 * @example
 * ```typescript
 * import {valueObject} from "valueobject.ts";
 *
 * type PersonProps = {
 *   name: string,
 *   age: number,
 * };
 *
 * class Person extends valueObject<PersonProps>().withKeys(["name", "age"]) {
 *   greet(): string {
 *     return `Hello, I am ${this.name}.`;
 *   }
 *   growOne(): Person {
 *     return new Person({...this, age: this.age + 1});
 *   }
 * }
 * ```
 */
export const valueObjectClass = <T extends SafeObject>() => ({
  /**
   * @param keys keys to filter props
   * @return Base class of the value object to extends
   */
  keys: <K extends keyof T>(
    keys: readonly K[],
  ): ValueObjectConstructor<{[FK in K]: T[FK]}> => {
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
