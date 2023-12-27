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
import UseTestComponent from './data/UseTestComponent.vue';

/**
 * Unit test of the `@Component` decorator.
 *
 * @author Haixing Hu
 */
describe('Multiple copy of component share the same object', () => {
  test('renders correctly', async () => {
    console.dir(UseTestComponent, { depth: null });
    const wrapper = mount(UseTestComponent);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const page1 = wrapper.vm.$refs.page1;
    const page1_msg = wrapper.get('.page1 .message');
    expect(page1_msg.text()).toBe('Hello World');
    const page1_data = wrapper.get('.page1 .data');
    expect(page1.data).toEqual([1, 2, 3]);
    expect(page1_data.text()).toBe('[1,2,3]');
    const page1_btn1 = wrapper.get('.page1 .button1');
    page1_btn1.trigger('click');
    await nextTick();
    expect(page1_msg.text()).toBe('Changed');
    const page1_btn2 = wrapper.get('.page1 .button2');
    page1_btn2.trigger('click');
    await nextTick();
    expect(page1.data).toEqual([2, 2, 3]);
    expect(page1_data.text()).toBe('[2,2,3]');

    const page2 = wrapper.vm.$refs.page2;
    const page2_msg = wrapper.get('.page2 .message');
    expect(page2_msg.text()).toBe('Hello World');
    const page2_data = wrapper.get('.page2 .data');
    expect(page2.data).toEqual([1, 2, 3]);
    expect(page2_data.text()).toBe('[1,2,3]');
    const page2_btn1 = wrapper.get('.page2 .button1');
    page2_btn1.trigger('click');
    await nextTick();
    expect(page2_msg.text()).toBe('Changed');
    const page2_btn2 = wrapper.get('.page2 .button2');
    page2_btn2.trigger('click');
    await nextTick();
    expect(page2.data).toEqual([2, 2, 3]);
    expect(page2_data.text()).toBe('[2,2,3]');
  });
  test('should not share the same data object', async () => {
    const wrapper = mount(UseTestComponent);
    expect(wrapper.exists()).toBe(true);
    const page1 = wrapper.vm.$refs.page1;
    const page2 = wrapper.vm.$refs.page2;
    expect(page1.data === page2.data).toBe(false);
  });
});
