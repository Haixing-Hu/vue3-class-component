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
import HelloComponent from '../data/HelloComponent.vue';
import UseHelloComponent from '../data/UseHelloComponent.vue';

/**
 * Unit tests the `@Prop` decorator.
 *
 * @author Haixing Hu
 */
describe('@Prop decorator', () => {
  test('should work', async () => {
    console.log('HelloComponent:', HelloComponent);
    console.log('UseHelloComponent:', UseHelloComponent);
    const wrapper = mount(UseHelloComponent);
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
  });
});
