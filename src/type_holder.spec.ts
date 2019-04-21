import {TypeHolder, Restore, type} from "./type_holder";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const expectType = <T1 extends {[k: string]: TypeHolder}>(_1: T1) => {
  return <T2 extends Restore<T1>>(_2?: T2) => {};
};

describe("static type functions", () => {
  it("basic usage", () => {
    const is = expectType({
      foo: type<string>(),
      bar: type<number | string>(),
      baz: type<null | undefined>(),
    });
    is<{foo: string; bar: number | string; baz: null | undefined}>();
    is({foo: "str", bar: 0, baz: undefined});
    is({foo: "str", bar: "str", baz: undefined});
    is({foo: "str", bar: "str", baz: null});
  });

  it("alias", () => {
    const is = expectType({
      foo: type.string,
      bar: type.number,
      baz: type.boolean,
      qux: type.null,
      quux: type.undefined,
    });
    is<{foo: string; bar: number; baz: boolean; qux: null; quux: undefined}>();
    is({foo: "str", bar: 0, baz: true, qux: null, quux: undefined});
  });

  it("optional, array, union", () => {
    const is = expectType({
      foo: type.optional(type.string),
      bar: type.array(type.number),
      baz: type.union(type.null, type.undefined),
    });
    is<{foo?: string; bar: number[]; baz: null | undefined}>();
    is({bar: [], baz: null});
    is({foo: "str", bar: [0, 1, 2], baz: undefined});
  });
});
