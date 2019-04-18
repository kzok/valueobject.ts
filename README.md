# valueobject.ts

Tiny typesafe value object library for TypeScript.

<!-- TOC -->

-   [Brief example](#brief-example)
-   [Features](#features)
-   [Why and when to use this?](#why-and-when-to-use-this)
-   [Installation](#installation)
-   [API reference](#api-reference)
-   [Credits](#credits)

<!-- /TOC -->

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
    greet: undefined,
    growOne: () => {
        throw new Error("The method won't be overwritten!");
    },
};
const person = ((a: ValueType<typeof Person>) => new Person(a))(initialValue);

console.log(person.greet());
// "Hello, I am Bob."
console.log(person.growOne().age);
// 21
```

## Features

-   Built to ES5
-   commonjs & ES6 module
-   Runtime object property-key filtering to avoid class fields overwriting
-   Typesafe and immutable class properties
-   Spread operator of `this` can initialize a new instance

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

With many properties, this approach is frustrating. This library is created for handling such a large value object more easily.

## Installation

Please use [npm](https://www.npmjs.com/).

```
$ npm install valueobject.ts
```

Then, use javascript module bundler like [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en) to bundle this library with your code.

## API reference

TODO: write

## Credits

-   The type definition system in this library is heavily inspired by [io-ts](https://github.com/gcanti/io-ts), that is awesome.
