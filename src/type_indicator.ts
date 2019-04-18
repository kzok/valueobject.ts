/** Static required type holder */
type RequiredTypeHolder<T> = {
  ___VALUEOBJECT_TS___REQUIRED_TYPE_HOLDER: T;
};

/** Static optional type holder */
type OptionalTypeHolder<T> = {
  ___VALUEOBJECT_TS___OPTIONAL_TYPE_HOLDER: T;
};

export interface TypeHolderDictionary {
  readonly [k: string]: RequiredTypeHolder<any> | OptionalTypeHolder<any>;
}

/** Type-function to extract optional keys */
type RequiredKeys<T extends TypeHolderDictionary> = {
  [P in keyof T]: T[P] extends RequiredTypeHolder<any> ? P : never
}[keyof T];

/** Type-function to extract optional keys */
type OptionalKeys<T extends TypeHolderDictionary> = {
  [P in keyof T]: T[P] extends OptionalTypeHolder<any> ? P : never
}[keyof T];

/** Type-function to restore type holder dictionary */
export type Restore<T extends TypeHolderDictionary> = Readonly<
  {
    [P in RequiredKeys<T>]: T[P] extends RequiredTypeHolder<infer R> ? R : never
  } &
    {
      [P in OptionalKeys<T>]?: T[P] extends OptionalTypeHolder<infer R>
        ? R
        : never
    }
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
