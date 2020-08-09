# valueobject.ts

---

Tiny typesafe value object library for TypeScript.

[![](https://img.shields.io/npm/v/valueobject.ts.svg)](https://www.npmjs.com/package/valueobject.ts) [![](https://img.shields.io/david/kzok/valueobject.ts.svg)](https://david-dm.org/kzok/valueobject.ts) [![CircleCI](https://circleci.com/gh/kzok/valueobject.ts/tree/master.svg?style=shield)](https://circleci.com/gh/kzok/valueobject.ts/tree/master) [![codecov](https://codecov.io/gh/kzok/valueobject.ts/branch/master/graph/badge.svg)](https://codecov.io/gh/kzok/valueobject.ts)

<!-- TOC -->

-   [valueobject.ts](#valueobjectts)
    -   [Features](#features)
    -   [Brief example](#brief-example)
    -   [Why and when to use this?](#why-and-when-to-use-this)
    -   [Installation](#installation)
    -   [API reference](#api-reference)
    -   [Credits](#credits)

<!-- /TOC -->

## Features

-   ecmascript 5
-   less than 1k bytes with zero dependencies
-   commonjs & es module
-   typesafe and immutable class properties
-   object keys filtering in runtime

## Brief example

```typescript
import {valueObjectClass} from "@kzok/valueobject-ts";

type PersonProps = {
    name: string;
    age: number;
};

const personKeys = ["name", "age"] as const;

class Person extends valueObjectClass<PersonProps>().keys(personKeys) {
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
const person = new Person(initialValue);

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
So many prior value object libraries introduce following approach.

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
Because TypeScript doesn't have Exact Type, runtime error occurs in a following case.

```TypeScript
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

const nextValueObject = new SomeLargeValueObject(passedData);

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

<a name="api-value-object-class" href="#api-value-object-class">#</a>function **valueObjectClass**()

Returns object with a property `keys` which is the function that takes array of property keys to filter and return the base class of the value object.

## Credits

-   This library is inspired by the prior arts below:
    -   https://github.com/alexeyraspopov/dataclass
    -   https://github.com/almin/ddd-base#valueobject
