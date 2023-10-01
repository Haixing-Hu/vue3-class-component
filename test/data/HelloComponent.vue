<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="hello-component">
    <div id="message">{{ message }}</div>
    <div id="value1">{{ value1 }}</div>
    <div id="value2">{{ value2 }}</div>
    <div id="computed">{{ computedValue }}</div>
  </div>
</template>
<script>
import { Component, toVue, Prop } from '../../index';

@Component
class HelloComponent {
  @Prop
  message = 'No Message';

  @Prop({ type: Number })
  value1;

  @Prop
  value2 = 123;

  mounted() {
    console.log('HelloComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.value1:', this.value1);
    console.log('this.value2:', this.value2);
    console.log('HelloComponent.mounted: exit');
  }

  get computedValue() {
    return this.value1 + this.value2;
  }
}

export default toVue(HelloComponent);
</script>
