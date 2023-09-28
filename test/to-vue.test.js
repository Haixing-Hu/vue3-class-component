/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { Component, toVue } from '../index';

/**
 * Unit test of the `toVue` function.
 *
 * @author Haixing Hu
 */
describe('toVue function', () => {
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
    const options = toVue(Foo)
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
      name: 'Too',
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
    const options = toVue(Goo);
    expect(options.name).toBe('Too');
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
});
