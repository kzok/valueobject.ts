
/** Static type indicator */
type TypeIndicator<_ = unknown> = {
  ___VALUEOBJECT___TS_TYPE_INDICATOR: never;
};

/** Static optional indicator */
type OptionalIndicator<_ = unknown> = {
  ___VALUEOBJECT_TS___OPTIONAL_INDICATOR: never;
};

/** Type-function to restore indicators */
type TypeOf<T extends TypeIndicator | OptionalIndicator>
  = T extends TypeIndicator<infer R> ? R
  : T extends OptionalIndicator<infer R> ? R
  : never;

/** Dictionary type indicator */
export interface ObjectTypeIndicator {
  readonly [k: string]: TypeIndicator | OptionalIndicator
}

/** Type-function to extract optional keys */
type OptionalKeys<T extends ObjectTypeIndicator> = {
  [P in keyof T]: T[P] extends OptionalIndicator ? P : never;
}[keyof T];

/** Type-function to restore type holder dictionary */
export type Restore<T extends ObjectTypeIndicator> = Readonly<
  {[P in OptionalKeys<T>]?: TypeOf<T[P]>}
  & {[P in Exclude<keyof T, OptionalKeys<T>>]: TypeOf<T[P]>}
>;

/** Dummy entity for TypeHolder & OptionalHolder */
const DUMMY: TypeIndicator & OptionalIndicator = null as any;

/** TypeHolder factories */
export const type = <T>(): TypeIndicator<T> => DUMMY;
type.string = type<string>();
type.number = type<number>();
type.boolean = type<boolean>();
type.null = type<null>();
type.undefined = type<undefined>();
type.array = <T>(_?: TypeIndicator<T>) => DUMMY as TypeIndicator<ReadonlyArray<T>>;
type.optional = <T>(_?: TypeIndicator<T>) => DUMMY as OptionalIndicator<T>;
type.union = <T>(..._: TypeIndicator<T>[]) => DUMMY as TypeIndicator<T>;
