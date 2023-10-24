////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { Component, toVue } from '../src';

function AddMessage(target) {
  // add a new field to the target class
  target.prototype.message = 'Hello';
}

@Component({
  template: '<div><div id="value">{{ value }}</div><div id="message">{{ message }}</div></div>',
})
@AddMessage
class Test {
  value = 123;
}
const TestComponent = toVue(Test);

describe('bug #5', () => {
  test('Should handle the class field added to the prototype of the class', async () => {
    const w1 = mount(TestComponent);
    const v1 = w1.vm;
    expect(v1.value).toBe(123);
    expect(v1.message).toBe('Hello');
    const w2 = mount(TestComponent);
    const v2 = w2.vm;
    expect(v2.value).toBe(123);
    expect(v2.message).toBe('Hello');
    v2.message = 'World';
    expect(v1.message).toBe('Hello');
    expect(v2.message).toBe('World');
    await nextTick();
    const m1 = w1.get('#message');
    const m2 = w2.get('#message');
    expect(m1.text()).toBe('Hello');
    expect(m2.text()).toBe('World');
  });
});
