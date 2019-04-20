/** Static required type holder */
export abstract class RequiredTypeHolder<T extends any = any> {
  private tag!: "required";
  _!: T;
}

/** Static optional type holder */
export abstract class OptionalTypeHolder<T extends any = any> {
  private tag!: "optional";
  _!: T;
}

export type TypeHolder<T extends any = any> =
  | RequiredTypeHolder<T>
  | OptionalTypeHolder<T>;

/** Type-function to extract type holder */
type TypeOf<T extends TypeHolder> = T extends TypeHolder ? T["_"] : never;

/** Type-function to extract optional keys */
type RequiredKeys<T extends {[k: string]: TypeHolder}> = {
  [P in keyof T]: T[P] extends RequiredTypeHolder ? P : never
}[keyof T];

/** Type-function to extract optional keys */
type OptionalKeys<T extends {[k: string]: TypeHolder}> = {
  [P in keyof T]: T[P] extends OptionalTypeHolder ? P : never
}[keyof T];

/** Type-function to restore type holder dictionary */
export type Restore<T extends {[k: string]: TypeHolder}> = Readonly<
  {[P in RequiredKeys<T>]: TypeOf<T[P]>} &
    {[P in OptionalKeys<T>]?: TypeOf<T[P]>}
>;

/** Dummy entity for TypeHolders */
const D: RequiredTypeHolder<any> & OptionalTypeHolder<any> = null as any;

/** TypeHolder factories */
export const type = <T = unknown>(): RequiredTypeHolder<T> => D;
type.string = type<string>();
type.number = type<number>();
type.boolean = type<boolean>();
type.null = type<null>();
type.undefined = type<undefined>();
type.array = <T>(_?: RequiredTypeHolder<T>) =>
  D as RequiredTypeHolder<ReadonlyArray<T>>;
type.optional = <T>(_?: RequiredTypeHolder<T> | OptionalTypeHolder<T>) =>
  D as OptionalTypeHolder<T>;
type.union = <T>(..._: RequiredTypeHolder<T>[]) => D as RequiredTypeHolder<T>;
