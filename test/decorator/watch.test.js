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
import WatchComponent from '../data/WatchComponent.vue';
import UseWatchComponent from '../data/UseWatchComponent.vue';
import { Component, Watch } from '../../index';

/**
 * Unit tests the `@Watch` decorator.
 *
 * @author Haixing Hu
 */
describe('@Watch decorator', () => {
  test('should work', async () => {
    console.log('WatchComponent:', WatchComponent);
    console.log('UseWatchComponent:', UseWatchComponent);
    const wrapper = mount(UseWatchComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const msg = wrapper.get('#message');
    expect(msg.text()).toBe('Hello World');
    const val1 = wrapper.get('#value1');
    expect(val1.text()).toBe('123');
    const val2 = wrapper.get('#value2');
    expect(val2.text()).toBe('0');
    const computed = wrapper.get('#computed');
    expect(computed.text()).toBe('123');
    const person1Name = wrapper.get('#person1-name');
    expect(person1Name.text()).toBe('John_1');
    const person1Age = wrapper.get('#person1-age');
    expect(person1Age.text()).toBe('40');
    const person2Name = wrapper.get('#person2-name');
    expect(person2Name.text()).toBe('Mike_1');
    const person2Age = wrapper.get('#person2-age');
    expect(person2Age.text()).toBe('50');
    const value1ChangeCount = wrapper.get('#value1-change-count');
    expect(value1ChangeCount.text()).toBe('0');
    const value2ChangeCount = wrapper.get('#value2-change-count');
    expect(value2ChangeCount.text()).toBe('1');
    const messageChangeCount = wrapper.get('#message-change-count');
    expect(messageChangeCount.text()).toBe('1');
    const person1ChangeCount = wrapper.get('#person1-change-count');
    expect(person1ChangeCount.text()).toBe('0');
    const person2ChangeCount = wrapper.get('#person2-change-count');
    expect(person2ChangeCount.text()).toBe('0');

    const btn1 = wrapper.get('#button1');
    btn1.trigger('click');
    await nextTick();
    expect(val1.text()).toBe('124');
    expect(computed.text()).toBe('124');
    expect(value1ChangeCount.text()).toBe('1');

    const btn2 = wrapper.get('#button2');
    btn2.trigger('click');
    await nextTick();
    expect(val2.text()).toBe('1');
    expect(computed.text()).toBe('125');
    expect(value2ChangeCount.text()).toBe('2');

    const btn3 = wrapper.get('#button3');
    btn3.trigger('click');
    await nextTick();
    expect(msg.text()).toBe('Changed');
    expect(messageChangeCount.text()).toBe('2');

    const btn4 = wrapper.get('#button4');
    btn4.trigger('click');
    await nextTick();
    expect(person1Name.text()).toBe('John_1');
    expect(person1Age.text()).toBe('100');
    expect(person1ChangeCount.text()).toBe('0');

    const btn5 = wrapper.get('#button5');
    btn5.trigger('click');
    await nextTick();
    expect(person1Name.text()).toBe('John_2');
    expect(person1Age.text()).toBe('200');
    expect(person1ChangeCount.text()).toBe('1');

    const btn6 = wrapper.get('#button6');
    btn6.trigger('click');
    await nextTick();
    expect(person2Name.text()).toBe('Mike_1');
    expect(person2Age.text()).toBe('100');
    expect(person2ChangeCount.text()).toBe('1');

    const btn7 = wrapper.get('#button7');
    btn7.trigger('click');
    await nextTick();
    expect(person2Name.text()).toBe('Mike_2');
    expect(person2Age.text()).toBe('200');
    expect(person2ChangeCount.text()).toBe('2');
  });

  test('invalid path argument', () => {
    expect(() => {
      @Component
      class F1 {
        value1 = 123;

        @Watch(123)
        onValue1Change(val, oldVal) {
          console.log('val = ', val);
        }
      }
    }).toThrowWithMessage(
        TypeError,
        'The path argument of `@Watch` decorator must be a string.',
    );
  });

  test('decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        value1 = 123;

        @Watch('value1')
        message = 'hello';
      }
    }).toThrowWithMessage(
        Error,
        'The @Watch decorator can only be used to decorate a class method.',
    );
  });

  test('decorate on the same path twice', () => {
    expect(() => {
      @Component
      class F1 {
        value = 123;

        @Watch('value')
        onValueChanged1(val, oldVal) {
          console.log('val = ', val, ', oldVal = ', oldVal);
        }

        @Watch('value')
        onValueChanged2(val, oldVal) {
          console.log('val = ', val, ', oldVal = ', oldVal);
        }
      }
    }).toThrowWithMessage(
        Error,
        'The @Watch decorator can only be used once on the path "value".',
    );
  });
});
