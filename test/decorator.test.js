/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * Unit test of the `@Component` decorator.
 *
 * @author Haixing Hu
 */

// Get the name of the class field of a class
function getClassFields(cls) {
  const constructor = cls.prototype.constructor;
  const fieldNames = Object.getOwnPropertyNames(constructor.prototype);
  return fieldNames;
}

// Get the prototypes of all methods on the class and its parent class chain
function getAllMethodPrototypes(cls) {
  const methodPrototypes = [];
  let currentClass = cls;
  // Traverse the methods on the class and its parent class chain
  while (currentClass.prototype) {
    const proto = currentClass.prototype;
    // Get the method on the prototype
    const methods = Object.getOwnPropertyNames(proto)
      .filter((name) => name !== 'constructor')
      .map((name) => proto[name]);
    methodPrototypes.push(...methods);
    // Get the parent class of the current class
    currentClass = Object.getPrototypeOf(currentClass);
  }
  return methodPrototypes;
}

const DECORATORS_MAP = new WeakMap();

function newDecorator(factory) {
  if (typeof factory !== 'function') {
    throw new TypeError('The first argument must be a function.');
  }
  return (target, context) => {
    console.log('newDecorator: target = ', target, 'context = ', context);
    DECORATORS_MAP[target] ??= [];
    DECORATORS_MAP[target].push({ method: target, name: target.name });
    factory(target, context);
  };
}

function Component(Class) {
  const decorators = [];
  // loops all methods of Class
  const methods = getAllMethodPrototypes(Class);
  console.log('@Component: methods = ', methods);
  for (const method of methods) {
    console.log('@Component: method = ', method);
    const decors = DECORATORS_MAP[method];
    console.log('@Component: decors = ', decors);
    if (decors) {
      decorators.push(...decors);
    }
  }
  console.log('@Component: Class = ', Class.name, 'decorators = ', decorators);
}

// eslint-disable-next-line no-unused-vars
const Log = newDecorator((target, _) => {
  console.log('@Log: target.name = ', target.name);
});

@Component
class Foo {
  x = 0;

  y = 1;

  constructor() {
    this.z = 2;
  }

  @Log
  test1() {
    console.log('Foo.test1');
  }

  @Log
  test2() {
    console.log('Foo.test2');
  }
}

@Component
class Goo extends Foo {
  a = 3;

  b = 4;

  constructor(props) {
    super(props);
    this.c = 5;
  }

  @Log
  hello1() {
    console.log('Goo.hello1');
  }

  @Log
  hello2() {
    console.log('Goo.hello2');
  }
}

describe('@Component decorator', () => {
  test('simple test', () => {
    console.log('Foo.fields = ', getClassFields(Foo));
    console.log('Goo.fields = ', getClassFields(Goo));
    console.log('Foo.methods = ', getAllMethodPrototypes(Foo).map((p) => p.name));
    console.log('Goo.methods = ', getAllMethodPrototypes(Goo).map((p) => p.name));

    const foo = new Foo();
    foo.test1();
    foo.test2();
    // const goo = new Goo();
    // goo.hello1();
    // goo.hello2();

    // function hello(target, context) {
    //   console.log('Hello: target = ', target, 'context = ', context,
    //     'target.prototype = ', target.prototype);
    //   console.dir(target);
    //   console.dir(target.prototype);
    // }
    //
    //
    // class Bar {
    //   @hello
    //   foo() {
    //     console.log('foo');
    //   }
    // }
    //
    // const bar = new Bar();
    // bar.foo();
    // class MyClass {
    //   foo() {
    //     console.log('MyClass.foo');
    //   }
    // }
    //
    // const m = MyClass.prototype.foo;
    //
    // function printMethodClassName(method) {
    //   const className = method.constructor.name;
    //   console.log(`The method belongs to class: ${className}`);
    // }
    //
    // printMethodClassName(m);
  });
});
