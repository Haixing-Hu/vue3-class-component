/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { mount } from '@vue/test-utils';
import { Component, toVue } from '../src';

@Component
class TestComponent {
  value = 123;
}
const TestComponentVue = toVue(TestComponent);

describe('bug #4', () => {
  test('Different instance of the same component should not sharing data', async () => {
    const w1 = mount(TestComponentVue);
    const v1 = w1.vm;
    const w2 = mount(TestComponentVue);
    const v2 = w2.vm;
    expect(v1.value).toBe(123);
    expect(v2.value).toBe(123);
    v1.value = 456;
    expect(v1.value).toBe(456);
    expect(v2.value).toBe(123);
  });
});
