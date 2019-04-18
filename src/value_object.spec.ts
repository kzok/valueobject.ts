import {type} from "./type_indicator";
import {valueObject, ValueType} from "./value_object";

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

  it("Basic example", () => {
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

  it("The initialValue's property names should be filtered.", () => {
    const initialValue = {
      name: "Bob",
      age: 40,
      greet: undefined,
    };
    const person = ((arg: ValueType<typeof Person>) => new Person(arg))(
      initialValue,
    );
    expect(person.greet()).toBe("Hello, I am Bob.");
    expect(person.toJSON()).toEqual({
      name: "Bob",
      age: 40,
    });
  });
});
