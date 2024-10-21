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

describe('markRaw', () => {
  test('should work', async () => {
    const component = {
      template: `
        <div>
          <div class="x">{{ x }}</div>
          <div class="z">{{ z.key }}</div>
        </div>
      `,
      data() {
        return {
          x: 0,
        };
      },
      created() {
        console.log('created');
        this.x = 1;
        this.z.key++;
      },
      methods: {
        incX() {
          this.x += 1;
        },
        setZ() {
          this.z.key += 1;
        },
      },
      mixins: [{
        created() {
          console.log('mixins.created');
          this.z = { key: 0 };
        },
      }],
    };
    const wrapper = mount(component);
    expect(wrapper.exists()).toBe(true);
    await nextTick();
    const x = wrapper.get('.x');
    expect(x.text()).toBe('1');
    const z = wrapper.get('.z');
    expect(z.text()).toBe('1');
    wrapper.vm.incX();
    await nextTick();
    wrapper.vm.setZ();
    expect(z.text()).toBe('1');
    await nextTick();
    // expect(wrapper.vm.x).toBe(1);
    expect(wrapper.vm.z).toEqual({ key: 2 });
    await nextTick();
    // expect(x.text()).toBe('1');
    expect(z.text()).toBe('1');
  });
});
