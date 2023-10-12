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
import ProvideComponent from '../data/ProvideComponent.vue';
import InjectComponent from '../data/InjectComponent.vue';
import { Component, Provide, Inject } from '../../index';

/**
 * Unit tests the `@Provide`, `@Inject` decorators.
 *
 * @author Haixing Hu
 */
describe('@Provide, @Inject decorator', () => {
  test('should work', async () => {
    console.log('InjectComponent:', InjectComponent);
    console.log('ProvideComponent:', ProvideComponent);
    const wrapper = mount(ProvideComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const msg = wrapper.get('#message');
    expect(msg.text()).toBe('Hello World');
    const value1 = wrapper.get('#value1');
    expect(value1.text()).toBe('123');
    const value2 = wrapper.get('#value2');
    expect(value2.text()).toBe('456');
    const personName = wrapper.get('#person-name');
    expect(personName.text()).toBe('John');
    const personAge = wrapper.get('#person-age');
    expect(personAge.text()).toBe('32');

    const injectedMsg = wrapper.get('#injected-message');
    expect(msg.text()).toBe('Hello World');
    const injectedMyValue = wrapper.get('#injected-my-value');
    expect(injectedMyValue.text()).toBe('123');
    const injectedSymbolKeyValue = wrapper.get('#injected-symbol-key-value');
    expect(injectedSymbolKeyValue.text()).toBe('456');
    const injectedPersonName = wrapper.get('#injected-person-name');
    expect(injectedPersonName.text()).toBe('John');
    const injectedPersonAge = wrapper.get('#injected-person-age');
    expect(injectedPersonAge.text()).toBe('32');
    const injectedAnotherPersonName = wrapper.get('#injected-another-person-name');
    expect(injectedAnotherPersonName.text()).toBe('unknown');
    const injectedAnotherPersonAge = wrapper.get('#injected-another-person-age');
    expect(injectedAnotherPersonAge.text()).toBe('0');

    const btn1 = wrapper.get('#button1');
    btn1.trigger('click');
    await nextTick();
    expect(value1.text()).toBe('124');
    expect(injectedMyValue.text()).toBe('123');

    const btn2 = wrapper.get('#button2');
    btn2.trigger('click');
    await nextTick();
    expect(value2.text()).toBe('457');
    expect(injectedSymbolKeyValue.text()).toBe('457');

    const btn3 = wrapper.get('#button3');
    btn3.trigger('click');
    await nextTick();
    expect(msg.text()).toBe('Changed');
    expect(injectedMsg.text()).toBe('Hello World');

    const btn4 = wrapper.get('#button4');
    btn4.trigger('click');
    await nextTick();
    expect(personName.text()).toBe('John');
    expect(personAge.text()).toBe('100');
    expect(injectedPersonName.text()).toBe('John');
    expect(injectedPersonAge.text()).toBe('100');

    const btn5 = wrapper.get('#button5');
    btn5.trigger('click');
    await nextTick();
    expect(personName.text()).toBe('John_2');
    expect(personAge.text()).toBe('200');
    expect(injectedPersonName.text()).toBe('John_2');
    expect(injectedPersonAge.text()).toBe('200');
  });

  test('@Provide: invalid number of arguments', () => {
    expect(() => {
      @Component
      class F1 {
        @Provide({}, 'arg1', 'arg2')
        value1 = 123;
      }
      new F1();
    }).toThrowWithMessage(
      Error,
      'Invalid use of the `@Provide` decorator.',
    );
  });

  test('@Provide: decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        @Provide
        hello() {}
      }
      new F1();
    }).toThrowWithMessage(
      Error,
      'The @Provide decorator can only be used to decorate a class field.',
    );
  });

  test('@Inject: invalid number of arguments', () => {
    expect(() => {
      @Component
      class F1 {
        @Inject({}, 'arg1', 'arg2')
        value1 = 123;
      }
      new F1();
    }).toThrowWithMessage(
      Error,
      'Invalid use of the `@Inject` decorator.',
    );
  });

  test('@Inject: decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        @Inject
        hello() {}
      }
      new F1();
    }).toThrowWithMessage(
      Error,
      'The @Inject decorator can only be used to decorate a class field.',
    );
  });
});
