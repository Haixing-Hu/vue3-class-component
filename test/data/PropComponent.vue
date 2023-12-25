<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="prop-component">
    <div id="message">{{ message }}</div>
    <div id="value1">{{ value1 }}</div>
    <div id="value2">{{ value2 }}</div>
    <div id="value3">{{ value3 }}</div>
    <div id="value4">{{ value4 }}</div>
    <div id="value5">{{ value5 }}</div>
    <div id="computed">{{ computedValue }}</div>
    <div id="person-name">{{ person.name }}</div>
    <div id="person-age">{{ person.age }}</div>
    <div id="user-username">{{ user?.username }}</div>
    <div id="user-password">{{ user?.password }}</div>
  </div>
</template>
<script>
import { Component, toVue, Prop } from '../../src';
import User from './user';

@Component
class PropComponent {
  @Prop
  message = 'No Message';

  @Prop({ type: Number })
  value1;

  @Prop({ default: 123 })
  value2 = 123;

  @Prop
  person = {
    name: 'John',
    age: 30,
  };

  @Prop({ type: User })
  user = null;

  value3 = 0;

  value4 = 0;

  @Prop({ type: [Boolean, String] })
  value5;

  mounted() {
    console.log('PropComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.value1:', this.value1);
    console.log('this.value2:', this.value2);
    console.log('this.value3:', this.value3);
    console.log('this.value4:', this.value4);
    console.log('this.value5:', this.value5);
    console.log('this.person:', this.person);
    console.log('this.user:', this.user);
    console.log('PropComponent.mounted: exit');
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  set totalValue(val) {
    console.log('PropComponent.set totalValue:', val);
    this.value3 = Math.round(val / 2);
    this.value4 = val - this.value3;
    console.log('this.value3:', this.value3);
    console.log('this.value4:', this.value4);
    console.log('PropComponent.set totalValue: exit');
  }
}

export default toVue(PropComponent);
</script>
