////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import PropComponent from '../data/PropComponent.vue';
import UsePropComponent from '../data/UsePropComponent.vue';
import { Component, Prop } from '../../src';

/**
 * Unit tests the `@Prop` decorator.
 *
 * @author Haixing Hu
 */
describe('@Prop decorator', () => {
  test('should work', async () => {
    console.log('PropComponent:', PropComponent);
    console.log('UsePropComponent:', UsePropComponent);
    const wrapper = mount(UsePropComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const msg = wrapper.get('#message');
    expect(msg.text()).toBe('Hello World');
    const val1 = wrapper.get('#value1');
    expect(val1.text()).toBe('123');
    const val2 = wrapper.get('#value2');
    expect(val2.text()).toBe('0');
    const val3 = wrapper.get('#value3');
    expect(val3.text()).toBe('0');
    const val4 = wrapper.get('#value4');
    expect(val4.text()).toBe('0');
    const val5 = wrapper.get('#value5');
    expect(val5.text()).toBe('true');
    const computed = wrapper.get('#computed');
    expect(computed.text()).toBe('123');
    const personName = wrapper.get('#person-name');
    expect(personName.text()).toBe('John');
    const personAge = wrapper.get('#person-age');
    expect(personAge.text()).toBe('30');
    const username = wrapper.get('#user-username');
    expect(username.text()).toBe('admin');
    const password = wrapper.get('#user-password');
    expect(password.text()).toBe('123456');

    const btn1 = wrapper.get('#button1');
    btn1.trigger('click');
    await nextTick();
    expect(val1.text()).toBe('124');
    expect(computed.text()).toBe('124');
    const btn2 = wrapper.get('#button2');
    btn2.trigger('click');
    await nextTick();
    expect(val2.text()).toBe('1');
    expect(computed.text()).toBe('125');
    const btn3 = wrapper.get('#button3');
    btn3.trigger('click');
    await nextTick();
    expect(msg.text()).toBe('Changed');
    const btn4 = wrapper.get('#button4');
    btn4.trigger('click');
    await nextTick();
    expect(username.text()).toBe('guest');

    const btn5 = wrapper.get('#button5');
    btn5.trigger('click');
    await nextTick();
    expect(val3.text()).toBe('51');
    expect(val4.text()).toBe('50');

    wrapper.vm.value5 = 'Hello';
    await nextTick();
    expect(val5.text()).toBe('Hello');
  });

  test('invalid number of arguments', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({}, 'arg1', 'arg2')
        value1 = 123;
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'Invalid use of the `@Prop` decorator.',
    );
  });

  test('decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop
        hello() {}
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The @Prop decorator can only be used to decorate a class field.',
    );
  });

  test('default value not equals initial value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({ default: 0 })
        value = 123;
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The default value of the field "value" is different from the default '
        + 'value specified in arguments of the decorator.',
    );
  });

  test('type argument is not consist with the type of default value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({ type: String, default: 0 })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The type of the default value of the field "value" is Number, '
      + 'which is different from the type specified in arguments of the decorator.',
    );
  });

  test('non-required prop has no default value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({ type: Number, required: false })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The field "value" is not required, but it has no default value.',
    );
  });

  test('no type is specified', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The type of the field "value" is not specified.',
    );
  });

  test('type is not a function', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({ type: 'number' })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The type of the field "value" must be a constructor function or an array of constructor functions.',
    );
  });

  test('validator is not a function', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({ type: Number, validator: 'null' })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The validator of the field "value" must be a function.',
    );
  });
});
