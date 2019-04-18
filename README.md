# valueobject.ts

Tiny typesafe value object library for TypeScript.

<!-- TOC -->

- [Brief example](#brief-example)
- [Why and when to use this?](#why-and-when-to-use-this)
- [Installation](#installation)
- [API reference](#api-reference)

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

TODO: write

## API reference

TODO: write
