/**
 * Compile-time required type holder
 * @template T type to hold
 */
export abstract class RequiredTypeHolder<T extends any = any> {
  private _tag!: "required";
  _!: T;
}

/**
 * Compile-time optional type holder
 * @template T type to hold
 */
export abstract class OptionalTypeHolder<T extends any = any> {
  private _tag!: "optional";
  _!: T;
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
type TypeOf<T extends TypeHolder> = T extends TypeHolder ? T["_"] : never;

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
 * Dummy entity of type holder
 */
const DUMMY: RequiredTypeHolder<any> & OptionalTypeHolder<any> = null as any;

/**
 * TypeHolder factories
 * @template T type to hold
 * @returns type holder
 */
export const type = <T = unknown>(): RequiredTypeHolder<T> => DUMMY;

/**
 * Optional modifier of `type<T>()`
 */
type.optional = <T>(_?: RequiredTypeHolder<T>) =>
  DUMMY as OptionalTypeHolder<T>;

/**
 * An alias of `type<string>()`
 */
type.string = type<string>();

/**
 * An alias of `type<number>()`
 */
type.number = type<number>();

/**
 * An alias of `type<boolean>()`
 */
type.boolean = type<boolean>();

/**
 * An alias of `type<null>()`
 */
type.null = type<null>();

/**
 * An alias of `type<undefined>()`
 */
type.undefined = type<undefined>();

/**
 * An alias of `type<ReadonlyArray<T>>()`
 */
type.array = <T>(_?: RequiredTypeHolder<T>) =>
  DUMMY as RequiredTypeHolder<ReadonlyArray<T>>;

/**
 * An alias of `type<T1 | T2 | T3 | ...>()`
 */
type.union = <T>(..._: RequiredTypeHolder<T>[]) =>
  DUMMY as RequiredTypeHolder<T>;
