<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="v-model-component">
    <input
      id="input"
      v-model="message"
    />
  </div>
</template>
<script>
import { Component, toVue, VModel } from '../../src';

@Component
class VModelComponent {
  @VModel
  message = 'Hello world!';

  mounted() {
    console.log('VModelComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.modelValue:', this.modelValue);
    console.log('PropComponent.mounted: exit');
  }
}

export default toVue(VModelComponent);
</script>
