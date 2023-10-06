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
    <div id="computed">{{ computedValue }}</div>
    <div id="person-name">{{ person.name }}</div>
    <div id="person-age">{{ person.age }}</div>
    <div id="user-username">{{ user?.username }}</div>
    <div id="user-password">{{ user?.password }}</div>
  </div>
</template>
<script>
import { Component, toVue, Prop } from '../../index';
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

  mounted() {
    console.log('PropComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.value1:', this.value1);
    console.log('this.value2:', this.value2);
    console.log('this.person:', this.person);
    console.log('this.user:', this.user);
    console.log('PropComponent.mounted: exit');
  }

  get computedValue() {
    return this.value1 + this.value2;
  }
}

export default toVue(PropComponent);
</script>
