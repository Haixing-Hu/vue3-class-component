/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Component } from '../index';
import { OPTIONS_KEY } from '../src/metadata-keys';

/**
 * Unit test of the `@Component` decorator.
 *
 * @author Haixing Hu
 */
describe('@Component decorator', () => {
  test('@Component without options', () => {
    @Component
    class Foo {
      x = 1;
      y;
      constructor() {
        this.z = 3;
      }
      test() {}

      hello = () => { console.log('hello'); };

      get a() { return 1; }
      set a(value) { console.log('a = ', value); }

      mounted() {
        console.log('Foo.mounted');
      }
    }
    const metadata = Foo[Symbol.metadata];
    // console.log('Symbol.metadata:', Symbol.metadata);
    // console.log('Foo:', Foo);
    // console.log('metadata: ', metadata);
    const options = metadata[OPTIONS_KEY];
    expect(options.name).toBe('Foo');
    expect(options.mounted).toBe(Foo.prototype.mounted);
    expect(options.methods.test).toBe(Foo.prototype.test);
    expect(String(options.methods.hello)).toBe(String(new Foo().hello));
    expect(options.mixins.length).toBe(1);
    const mixin = {
      data() {
        return { x: 1, z: 3 };
      }
    }
    expect(String(options.mixins[0])).toBe(String(mixin));
    const a_descriptor = Object.getOwnPropertyDescriptor(Foo.prototype, 'a');
    expect(options.computed.a.get).toBe(a_descriptor.get);
    expect(options.computed.a.set).toBe(a_descriptor.set);
  });
  test('@Component with options', () => {
    class MyComponent {}
    @Component({
      components: {
        MyComponent,
      }
    })
    class Goo {
      x = 1;
      y;
      constructor() {
        this.z = 3;
      }
      test() {}

      hello = () => { console.log('hello'); };

      get a() { return 1; }
      set a(value) { console.log('a = ', value); }

      mounted() {
        console.log('Foo.mounted');
      }
    }
    const metadata = Goo[Symbol.metadata];
    // console.log('Symbol.metadata:', Symbol.metadata);
    // console.log('Goo:', Goo);
    // console.log('metadata: ', metadata);
    const options = metadata[OPTIONS_KEY];
    expect(options.name).toBe('Goo');
    expect(options.components).toEqual({ MyComponent });
    expect(options.mounted).toBe(Goo.prototype.mounted);
    expect(options.methods.test).toBe(Goo.prototype.test);
    expect(String(options.methods.hello)).toBe(String(new Goo().hello));
    expect(options.mixins.length).toBe(1);
    const mixin = {
      data() {
        return { x: 1, z: 3 };
      }
    }
    expect(String(options.mixins[0])).toBe(String(mixin));
    const a_descriptor = Object.getOwnPropertyDescriptor(Goo.prototype, 'a');
    expect(options.computed.a.get).toBe(a_descriptor.get);
    expect(options.computed.a.set).toBe(a_descriptor.set);
  });
  test('@Component with invalid options', () => {
    expect(() => {
      @Component({name: 'F1'}, {id: 2})
      class F1 {}
    }).toThrowWithMessage(
      TypeError,
      'The `@Component` can only decorate a class.',
    );
    expect(() => {
      @Component({name: 'F1'}, {id: 2}, {x: 3})
      class F1 {}
    }).toThrowWithMessage(
      TypeError,
      'Invalid use of the `@Component` decorator.',
    );
  });
  test('@Component on class with invalid options', () => {
    expect(() => {
      @Component({
        foo: 'foo',
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "foo" in the argument of @Component is not supported.',
    );
  });
  test('@Component on class with invalid Vue keyword `data`', () => {
    expect(() => {
      @Component({
        data: () => {
          return { x: 1 };
        },
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "data" in the argument of @Component should be declared as '
      + 'the class field.',
    );
  });
  test('@Component on class with invalid Vue keyword `props`', () => {
    expect(() => {
      @Component({
        props: ['x'],
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "props" in the argument of @Component should be declared as '
      + 'the class field and decorated by @Prop.',
    );
  });
  test('@Component on class with invalid Vue keyword `computed`', () => {
    expect(() => {
      @Component({
        computed: {
          x() {
            return 1;
          },
        },
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "computed" in the argument of @Component should be declared '
      + 'as the class setter.',
    );
  });
  test('@Component on class with invalid Vue keyword `methods`', () => {
    expect(() => {
      @Component({
        methods: {
          foo() {
            return 1;
          },
        },
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "methods" in the argument of @Component should be declared '
      + 'as the class method.',
    );
  });
  test('@Component on class with invalid Vue keyword `watch`', () => {
    expect(() => {
      @Component({
        watch: {
          x(val) {
            console.log(val);
          },
        },
      })
      class F1 {}
    }).toThrowWithMessage(
      Error,
      'The option "watch" in the argument of @Component should be declared '
      + 'as the class method and decorated by @Watch.',
    );
  });
});
