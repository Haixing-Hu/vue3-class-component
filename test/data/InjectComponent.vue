<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="inject-component">
    <div id="injected-message">{{ message }}</div>
    <div id="injected-my-value">{{ myValue }}</div>
    <div id="injected-symbol-key-value">{{ symbolKeyValue }}</div>
    <div id="injected-person-name">{{ person.name }}</div>
    <div id="injected-person-age">{{ person.age }}</div>
    <div id="injected-another-person-name">{{ anotherPerson.name }}</div>
    <div id="injected-another-person-age">{{ anotherPerson.age }}</div>
  </div>
</template>
<script>
import { Component, toVue, Inject } from '../../src';
import myInjectedKey from './inject-key-symbol';

@Component
class InjectComponent {
  @Inject
  message;

  @Inject
  myValue;

  @Inject({ from: myInjectedKey })
  symbolKeyValue;

  @Inject
  person;

  @Inject({ default: {name: 'unknown', age: 0} })
  anotherPerson;

  mounted() {
    console.log('InjectComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.myValue:', this.myValue);
    console.log('this.symbolKeyValue:', this.symbolKeyValue);
    console.log('this.person:', this.person);
    console.log('this.anotherPerson:', this.anotherPerson);
    console.log('InjectComponent.mounted: exit');
  }
}

export default toVue(InjectComponent);
</script>
