<template>
  <div id="message">{{ message }}</div>
  <div id="value1">{{ value1 }}</div>
  <div id="value2">{{ value2 }}</div>
  <div id="computed">{{ computedValue }}</div>
  <button
    id="button1"
    @click="increaseValue1"
  >
    Increase Value1
  </button>
  <button
    id="button2"
    @click="increaseValue2"
  >
    Increase Value2
  </button>
  <button
    id="button3"
    @click="setMessage('Changed')"
  >
    Change the message
  </button>
</template>
<script>
import { Component, toVue } from '../index';

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
