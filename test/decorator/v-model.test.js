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
import { Component, VModel } from '../../src';
import VModelComponent from '../data/VModelComponent.vue';
import UseVModelComponent from '../data/UseVModelComponent.vue';

/**
 * Unit tests the `@VModel` decorator.
 *
 * @author Haixing Hu
 */
describe('@VModel decorator', () => {
  test('should work', async () => {
    console.log('VModelComponent:', VModelComponent);
    console.log('UseVModelComponent:', UseVModelComponent);
    const wrapper = mount(UseVModelComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const input = wrapper.get('#input');
    expect(input.element.value).toBe('Here you are!');
    expect(wrapper.vm.message).toBe('Here you are!');
    const newMessageInput = wrapper.get('#new-message-input');
    expect(newMessageInput.element.value).toBe('');
    newMessageInput.setValue('Hello, Bill!');
    await nextTick();
    expect(wrapper.vm.newMessage).toBe('Hello, Bill!');
    expect(wrapper.vm.message).toBe('Here you are!');
    const button = wrapper.get('#button');
    button.trigger('click');
    await nextTick();
    expect(wrapper.vm.newMessage).toBe('Hello, Bill!');
    expect(wrapper.vm.message).toBe('Hello, Bill!');
    expect(input.element.value).toBe('Hello, Bill!');
    input.setValue('This is a new message.');
    await nextTick();
    expect(input.element.value).toBe('This is a new message.');
    expect(wrapper.vm.message).toBe('This is a new message.');
    expect(wrapper.vm.newMessage).toBe('Hello, Bill!');
  });

  test('invalid number of arguments', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel({}, 'arg1', 'arg2')
        value1 = 123;
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'Invalid use of the `@VModel` decorator.',
    );
  });

  test('decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel
        hello() {}
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The @VModel decorator can only be used to decorate a class field.',
    );
  });

  test('default value not equals initial value', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel({ default: 0 })
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
        @VModel({ type: String, default: 0 })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The type of the field "value" is Number, which is different from the type '
      + 'String specified in arguments of the decorator.',
    );
  });

  test('non-required prop has no default value', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel({ type: Number, required: false })
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
        @VModel
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
        @VModel({ type: 'number' })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The type of the field "value" must be a constructor function.',
    );
  });

  test('validator is not a function', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel({ type: Number, validator: 'null' })
        value;
      }
      new F1();
    }).toThrowWithMessage(
      TypeError,
      'The validator of the field "value" must be a function.',
    );
  });

  test('More than one field decorated by @VModel', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel
        value = 0;

        @VModel
        message = '';
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'Only one field can be decorated by @VModel.',
    );
  });

  test('A data field named with "modelValue"', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel
        value = 0;

        modelValue = '';
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The special name "modelValue" cannot be used as data field name.',
    );
  });

  test('A class method named with "modelValue"', () => {
    expect(() => {
      @Component
      class F1 {
        @VModel
        value = 0;

        modelValue() {
          console.log('hello world!');
        }
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The special name "modelValue" cannot be used as class method name.',
    );
  });

});
