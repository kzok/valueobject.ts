import {valueObjectClass} from "../value_object_class";

describe(valueObjectClass, () => {
  type PersonProps = {
    name: string;
    age: number;
  };

  class Person extends valueObjectClass<PersonProps>().keys(["name", "age"]) {
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
    expect({...person}).toEqual({name: "Mike", age: 20});

    const agedPerson = person.growOne();
    expect(person).not.toBe(agedPerson);
    expect(agedPerson.name).toBe("Mike");
    expect(agedPerson.age).toBe(21);
    expect(agedPerson.greet()).toBe("Hello, I am Mike.");
    expect({...agedPerson}).toEqual({name: "Mike", age: 21});
  });

  it("should filter property keys of inital value", () => {
    const initalValue = {
      name: "Bob",
      age: 20,
      greet: null,
      growOne: () => {
        throw new Error("The method won't be overwritten!");
      },
    };
    const person = new Person(initalValue as any);
    expect(person.greet()).toBe("Hello, I am Bob.");
    expect({...person}).toEqual({name: "Bob", age: 20});
    expect({...person}).not.toEqual(initalValue);
  });

  it(`can enumerate object keys with "Object.keys()"`, () => {
    const person = new Person({name: "Bob", age: 20});
    expect(Object.keys(person).sort()).toEqual(["age", "name"]);
  });

  it(`is durable of "__proto__" injection`, () => {
    const initialValue = {
      name: "Sam",
      age: 40,
      __proto__: {
        greet: () => {
          throw new Error("The prototype injection occured!");
        },
      },
    };
    const person = new Person(initialValue as any);
    expect(person.greet()).toBe("Hello, I am Sam.");
  });
});
