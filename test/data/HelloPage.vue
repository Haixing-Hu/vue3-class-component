<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="hello-page">
    <div class="message">{{ message }}</div>
    <div class="value1">{{ value1 }}</div>
    <div class="value2">{{ value2 }}</div>
    <div class="computed">{{ computedValue }}</div>
    <button
      class="button1"
      @click="increaseValue1"
    >
      Increase Value1
    </button>
    <button
      class="button2"
      @click="increaseValue2"
    >
      Increase Value2
    </button>
    <button
      class="button3"
      @click="setMessage('Changed')"
    >
      Change the message
    </button>
  </div>
</template>
<script>
import { Component, toVue } from '../../src';

@Component({
  name: 'Hello',
})
class HelloPage {
  message = 'No Message';

  value1 = 123;

  constructor() {
    this.value2 = 0;
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  mounted() {
    console.log('HelloPage.mounted: enter');
    console.log('this:', this);
    this.message = 'Hello World';
  }

  increaseValue1() {
    console.log('HelloPage.increaseValue1');
    console.log('this:', this);
    this.value1++;
  }

  increaseValue2() {
    console.log('HelloPage.increaseValue2');
    console.log('this:', this);
    this.value2++;
  }

  setMessage(s) {
    this.message = s;
  }
}

export default toVue(HelloPage);
</script>
