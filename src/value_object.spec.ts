import {type, valueObject, ValueType} from "./";

describe(valueObject, () => {
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

  it("can create value object", () => {
    const person = new Person({name: "Mike", age: 20});
    expect(person.name).toBe("Mike");
    expect(person.age).toBe(20);
    expect(person.greet()).toBe("Hello, I am Mike.");
    expect(person.toJSON()).toEqual({
      name: "Mike",
      age: 20,
    });

    const agedPerson = person.growOne();
    expect(person).not.toBe(agedPerson);
    expect(agedPerson.name).toBe("Mike");
    expect(agedPerson.age).toBe(21);
    expect(agedPerson.greet()).toBe("Hello, I am Mike.");
    expect(agedPerson.toJSON()).toEqual({
      name: "Mike",
      age: 21,
    });
  });

  it("should filter property keys of initalValue", () => {
    const initalValue = {
      name: "Bob",
      age: 20,
      greet: null,
      growOne: () => {
        throw new Error("The method won't be overwritten!");
      },
    };
    const person = new Person(initalValue as ValueType<typeof Person>);
    expect(person.greet()).toBe("Hello, I am Bob.");
    expect(person.toJSON()).toEqual({
      name: "Bob",
      age: 20,
    });
    expect(person.toJSON()).not.toEqual({
      name: "Bob",
      age: 20,
      greet: null,
    });
  });

  it(`is tolerant of "__proto__" injection`, () => {
    const initialValue = {
      name: "Sam",
      age: 40,
      __proto__: {
        greet: () => {
          throw new Error("The prototype injection occured!");
        },
        toJSON: () => {
          throw new Error("The prototype injection occured!");
        },
      },
    };
    const person = new Person(initialValue as ValueType<typeof Person>);
    expect(person.greet()).toBe("Hello, I am Sam.");
    expect(person.toJSON()).toEqual({
      name: "Sam",
      age: 40,
    });
  });

  it("can compare shallow equality with another value object", () => {
    const person = new Person({name: "mike", age: 20});
    expect(person.equals(new Person({name: "mike", age: 20}))).toBe(true);
    expect(person.equals(new Person({name: "mike", age: 21}))).toBe(false);
    expect(person.equals(new Person({name: "sam", age: 20}))).toBe(false);
    expect(person.equals({name: "mike", age: 20})).toBe(true);
    expect(person.equals({name: "mike", age: 20, excess: null} as any)).toBe(
      false,
    );
  });

  it("throws an exception when you mutate a value object's property", () => {
    const person = new Person({name: "mike", age: 20});
    expect(() => ((person as any).name = "bob")).toThrowError();
    expect(() => ((person as any).age = 21)).toThrowError();
    expect(person.toJSON()).toEqual({name: "mike", age: 20});
  });
});
