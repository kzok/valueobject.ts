# valueobject.ts

---

Tiny typesafe value object library for TypeScript.

[![](https://img.shields.io/npm/v/valueobject.ts.svg)](https://www.npmjs.com/package/valueobject.ts) [![](https://img.shields.io/david/kzok/valueobject.ts.svg)](https://david-dm.org/kzok/valueobject.ts) [![CircleCI](https://circleci.com/gh/kzok/valueobject.ts/tree/master.svg?style=shield)](https://circleci.com/gh/kzok/valueobject.ts/tree/master) [![codecov](https://codecov.io/gh/kzok/valueobject.ts/branch/master/graph/badge.svg)](https://codecov.io/gh/kzok/valueobject.ts)

<!-- TOC -->

-   [Features](#features)
-   [Brief example](#brief-example)
-   [Why and when to use this?](#why-and-when-to-use-this)
-   [Installation](#installation)
-   [API reference](#api-reference)
-   [Credits](#credits)

<!-- /TOC -->

## Features

-   ecmascript 5
-   about 1k bytes with zero dependencies
-   commonjs & es module
-   typesafe and immutable class properties
-   object keys filtering in runtime
-   defining static type and runtime object keys at once

## Brief example

```typescript
import {valueObject, type, ValueType} from "valueobject.ts";

class Person extends valueObject({
    name: type.string,
    age: type.number,
}) {
    greet(): string {
        return `Hello, I am ${this.name}.`;
    }
    growOne(): Person {
        return new Person({...this, age: this.age + 1});
    }
}

const initialValue = {
    name: "Bob",
    age: 20,
    greet: null,
    growOne: () => {
        throw new Error("The method won't be overwritten!");
    },
};
const person = new Person(initialValue as ValueType<typeof Person>);

console.log(person.greet());
// "Hello, I am Bob."
console.log(person.growOne().age);
// 21
```

## Why and when to use this?

In TypeScript, you can easily create value object with [parameter properties](https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties) like the following:

```typescript
class Person {
    constructor(public readonly name: string, public readonly age: number) {}
    greet(): string {
        return `Hello, I am ${this.name}.`;
    }
    growOne(): Person {
        return new Person(this.name, this.age + 1);
    }
}
```

However, with more properties, you'll want to use named parameters like the following:

```typescript
class SomeLargeValueObject {
    public readonly prop1: number | null;
    public readonly prop2: number | null;
    public readonly prop3: number | null;
    /**
     * ... more props ...
     */
    constructor(args: {
        prop1: number | null;
        prop2: number | null;
        prop3: number | null;
        /**
         * ... more props ...
         */
    }) {
        this.prop1 = arg.prop1;
        this.prop2 = arg.prop2;
        this.prop3 = arg.prop3;
        /**
         * ... more assingments ...
         */
    }
}
```

With many properties, this approach is frustrating.
So many prior value object libraries introduce the following approach.

```typescript
interface ValueObjectConstructor<T extends {[k: string]: any}> {
    new (initialValue: T): Readonly<T>;
}

const valueObject = <T extends {[k: string]: any}>(): ValueObjectConstructor<T> => {
    return class {
        constructor(arg: T) {
            Object.assign(this, arg);
        }
    } as any;
};

//-----------------

interface SomeLargeValueData {
    prop1: number | null;
    prop2: number | null;
    prop3: number | null;
    /**
     * ... more props ...
     */
}

class SomeLargeValueObject extends valueObject<SomeLargeValueData>() {
    isValid(): boolean {
        /** ... */
    }
}
```

In TypeScript, however, this approach has a problem.
Because TypeScript has no exact type, a runtime error occurs in the following case.

```TypeScript
const factory = (data: SomeLargeValueData): SomeLargeValueObject => {
    return new SomeLargeValueObject(data);
}

const passedData = {
    prop1: 1,
    prop2: 2,
    prop3: 3,
    /**
     * ... more props ...
     */
    // Oops! This will overwrite the class method!
    isValid: true,
    /**
     * ... some more other props for other usecases ...
     */
};

const nextValueObject = factory(passedData);

//-----------------

// TypeError: isValid is not a function
if (nextValueObject.isValid()) {
    /** ... */
}

```

Because of that, this library filters constructor argument's property keys.

## Installation

Please use [npm](https://www.npmjs.com/).

```
$ npm install valueobject.ts
```

Then, use javascript module bundler like [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en) to bundle this library with your code.

## API reference

<a name="api-value-object" href="#api-value-object">#</a>function **valueObject**(_typedef_)

Returns value object base class. The base class has 2 method, `toJSON()` which returns plain object of its data, and `equals(other)` which compare shallowly with passed parameter _other_. The parameter _typedef_'s type is plain object with properties type `TypeHolder`, which can create with `type<T>()` function.

<a name="api-type" href="#api-type">#</a>function **type**<_T_>()

Returns `TypeHolder` that contains type _T_, to create value object type definition. Its basic usage is like following.

```typescript
class Comment extends valueObject({
    createdAt: type<Date>(),
    text: type<string>(),
    parent: type<Comment | null>(),
}) {
    /** ... */
}
```

`type()` has aliases of following frequent usecases.

-   `type.string`
    -   equals to `type<string>()`
-   `type.number`
    -   equals to `type<number>()`
-   `type.boolean`
    -   equals to `type<boolean>()`
-   `type.null`
    -   equals to `type<null>()`
-   `type.undefined`
    -   equals to `type<undefined>()`
-   `type.array<T>(arg?: T)`
    -   example: `type.array(type.string)`
-   `type.optional<T>(arg?: T)`
    -   required to define optional field
-   `type.union<T>(...args: T[])`
    -   example: `type.union(type.string, type.null)`

<a name="api-value-type" href="#api-value-type">#</a>type **ValueType**<_T_>

Returns value object data type of the type parameter. Please use like following.

```typescript
type PersonData = ValueType<typeof Person>;
```

## Credits

-   This library is inspired by the prior arts below:
    -   https://github.com/alexeyraspopov/dataclass
    -   https://github.com/almin/ddd-base#valueobject
-   The type definition system in this library is heavily influenced by [io-ts](https://github.com/gcanti/io-ts).
