////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Component, Raw } from '../src';
import HelloPageWithRaw from './data/HelloPageWithRaw.vue';

describe('@Raw decorator', () => {
  test('should work', async () => {
    console.dir(HelloPageWithRaw);
    const wrapper = mount(HelloPageWithRaw);
    console.dir(wrapper.vm);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const msg = wrapper.get('.message');
    expect(msg.text()).toBe('Hello World');
    const val1 = wrapper.get('.value1');
    expect(val1.text()).toBe('10');
    const val2 = wrapper.get('.value2');
    expect(val2.text()).toBe('2');
    const rawVal1 = wrapper.get('.raw-value-1');
    expect(rawVal1.text()).toBe('12');
    const rawVal2 = wrapper.get('.raw-value-2');
    expect(rawVal2.text()).toBe('13');
    const computed = wrapper.get('.computed');
    expect(computed.text()).toBe('37');
    const btn1 = wrapper.get('.button1');
    btn1.trigger('click');
    await nextTick();
    expect(val1.text()).toBe('11');
    expect(computed.text()).toBe('38');
    const btn2 = wrapper.get('.button2');
    btn2.trigger('click');
    await nextTick();
    expect(val2.text()).toBe('3');
    expect(computed.text()).toBe('39');
    const btn3 = wrapper.get('.button3');
    btn3.trigger('click');
    await nextTick();
    expect(msg.text()).toBe('Changed');
    const btn4 = wrapper.get('.button4');
    btn4.trigger('click');
    await nextTick();
    expect(rawVal1.text()).toBe('12');
    expect(computed.text()).toBe('39');
    const btn5 = wrapper.get('.button5');
    btn5.trigger('click');
    await nextTick();
    expect(rawVal2.text()).toBe('13');
    expect(computed.text()).toBe('39');
    btn1.trigger('click');
    await nextTick();
    expect(val1.text()).toBe('12');
    expect(computed.text()).toBe('42');
  });

  test('decorate non-field', () => {
    expect(() => {
      @Component
      class F1 {
        @Raw
        hello() {}
      }
      new F1();
    }).toThrowWithMessage(
      SyntaxError,
      'The @Raw decorator can only be used to decorate a class field.',
    );
  });
});
