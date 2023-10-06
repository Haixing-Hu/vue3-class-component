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
import PropComponent from '../data/PropComponent.vue';
import UsePropComponent from '../data/UsePropComponent.vue';
import {Component, Prop, Watch} from '../../index';

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
  });

  test('invalid number of arguments', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({}, 'arg1', 'arg2')
        value1 = 123;
      }
    }).toThrowWithMessage(
        Error,
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
    }).toThrowWithMessage(
        Error,
        'The @Prop decorator can only be used to decorate a class field.',
    );
  });

  test('default value not equals initial value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({default: 0})
        value = 123;
      }
    }).toThrowWithMessage(
        Error,
        'The default value of the field "value" is different from the default '
        + 'value specified in arguments of the @Prop decorator.',
    );
  });

  test('type argument is not consist with the type of default value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({type: String, default: 0})
        value;
      }
    }).toThrowWithMessage(
        Error,
        'The type of the field "value" is Number, which is different from the type '
        + 'String specified in arguments of the @Prop decorator.',
    );
  });

  test('non-required prop has no default value', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({type: Number, required: false})
        value;
      }
    }).toThrowWithMessage(
        Error,
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
    }).toThrowWithMessage(
        Error,
        'The type of the field "value" is not specified.',
    );
  });

  test('type is not a function', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({type:'number'})
        value;
      }
    }).toThrowWithMessage(
        Error,
        'The type of the field "value" must be a constructor function.',
    );
  });

  test('validator is not a function', () => {
    expect(() => {
      @Component
      class F1 {
        @Prop({type: Number, validator: 'null'})
        value;
      }
    }).toThrowWithMessage(
        Error,
        'The validator of the field "value" must be a function.',
    );
  });
});
