/**
 * Compile-time required type holder
 * @template T type to hold
 */
export abstract class RequiredTypeHolder<_ extends any = any> {
  protected readonly _tag = "required" as const;
}

/**
 * Compile-time optional type holder
 * @template T type to hold
 */
export abstract class OptionalTypeHolder<_ extends any = any> {
  protected readonly _tag = "optional" as const;
}

/**
 * Compile-time type holder
 * @template T type to hold
 */
export type TypeHolder<T extends any = any> =
  | RequiredTypeHolder<T>
  | OptionalTypeHolder<T>;

/**
 * Type-function to extract type from type holder
 */
type TypeOf<T extends TypeHolder> = T extends TypeHolder<infer R> ? R : never;

/**
 * Type-function to extract required keys
 * @template T dictionary of type holder
 */
type RequiredKeys<T extends {[k: string]: TypeHolder}> = {
  [P in keyof T]: T[P] extends RequiredTypeHolder ? P : never
}[keyof T];

/**
 * Type-function to extract optional keys
 * @template T dictionary of type holder
 */
type OptionalKeys<T extends {[k: string]: TypeHolder}> = {
  [P in keyof T]: T[P] extends OptionalTypeHolder ? P : never
}[keyof T];

/**
 * Type-function to restore type holder dictionary
 * @template T dictionary of type holder
 */
export type Restore<T extends {[k: string]: TypeHolder}> = Readonly<
  {[P in RequiredKeys<T>]: TypeOf<T[P]>} &
    {[P in OptionalKeys<T>]?: TypeOf<T[P]>}
>;

/**
 * Dummy entity of `TypeHolder`
 */
const DUMMY: RequiredTypeHolder<any> & OptionalTypeHolder<any> = null as any;

/**
 * Dummy entity of `type`
 */
const _t = () => DUMMY;
_t.string = DUMMY;
_t.number = DUMMY;
_t.boolean = DUMMY;
_t.null = DUMMY;
_t.undefined = DUMMY;
_t.optional = _t;
_t.array = _t;
_t.union = _t;

export const type: {
  /**
   * TypeHolder factories
   * @template T type to hold
   * @returns type holder
   */
  <T = unknown>(): RequiredTypeHolder<T>;
  /**
   * An alias of `type<string>()`
   */
  readonly string: RequiredTypeHolder<string>;
  /**
   * An alias of `type<number>()`
   */
  readonly number: RequiredTypeHolder<number>;
  /**
   * An alias of `type<boolean>()`
   */
  readonly boolean: RequiredTypeHolder<boolean>;
  /**
   * An alias of `type<null>()`
   */
  readonly null: RequiredTypeHolder<null>;
  /**
   * An alias of `type<undefined>()`
   */
  readonly undefined: RequiredTypeHolder<undefined>;
  /**
   * Optional modifier of `type<T>()`
   */
  optional<T>(_?: RequiredTypeHolder<T>): OptionalTypeHolder<T>;
  /**
   * An alias of `type<ReadonlyArray<T>>()`
   */
  array<T>(_?: RequiredTypeHolder<T>): RequiredTypeHolder<readonly T[]>;
  /**
   * An alias of `type<T1 | T2 | T3 | ...>()`
   */
  union<T>(..._: RequiredTypeHolder<T>[]): RequiredTypeHolder<T>;
} = _t;
