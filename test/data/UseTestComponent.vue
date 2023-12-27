<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="use-test-component">
    <test-component
      ref="page1"
      class="page1"
    />
    <test-component
      ref="page2"
      class="page2"
    />
  </div>
</template>
<script>
import { Component, toVue } from '../../src';
import TestComponent from './TestComponent.vue';

@Component({
  components: {
    TestComponent,
  },
})
class UseTestComponent {
  // empty
}

export default toVue(UseTestComponent);
</script>
