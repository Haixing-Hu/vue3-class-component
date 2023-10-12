/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Component, toVue, createDecorator } from '../index';

/**
 * Unit test of the `createDecorator()` function.
 *
 * @author Haixing Hu
 */
describe('createDecorator() function', () => {
  test('should work', async () => {
    const messages = [];
    const Log = createDecorator((Class, defaultInstance, target, context, options) => {
      if (context?.kind !== 'method') {
        throw new Error('The @Log decorator can only be used to decorate a class method.');
      }
      const methodName = context.name;
      const originalMethod = options.methods[methodName];
      // note that the following function can NOT be an arrow function
      options.methods[methodName] = function (...args) {
        messages.push(`Calling ${Class.name}.${methodName}() with arguments: ${args.join(', ')}`);
        console.log(`${Class.name}.${methodName}: ${args.join(', ')}`);
        return originalMethod.apply(this, args);
      };
    });
    @Component({
      template: '<div>'
          + '<div id="value">{{ value }}</div>'
          + '<div><button id="button" @click="addToValue(1)">Click</button></div>'
          + '</div>',
    })
    class MyComponent {
      value = 123;

      @Log
      addToValue(val) {
        this.value += val;
      }
    }
    const MyVueComponent = toVue(MyComponent);
    const wrapper = mount(MyVueComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const value = wrapper.get('#value');
    expect(value.text()).toBe('123');
    const button = wrapper.get('#button');
    button.trigger('click');
    await nextTick();
    expect(value.text()).toBe('124');
    expect(messages).toEqual([
      'Calling MyComponent.addToValue() with arguments: 1',
    ]);
    button.trigger('click');
    await nextTick();
    expect(value.text()).toBe('125');
    expect(messages).toEqual([
      'Calling MyComponent.addToValue() with arguments: 1',
      'Calling MyComponent.addToValue() with arguments: 1',
    ]);
  });

  test('invalid factory type', () => {
    expect(() => {
      createDecorator('abc');
    }).toThrowWithMessage(
      TypeError,
      'The argument of `createDecorator()` must be a function.',
    );
  });
});
