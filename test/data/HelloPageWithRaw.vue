<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="hello-page-with-raw">
    <div class="message">{{ message }}</div>
    <div class="value1">{{ value1 }}</div>
    <div class="value2">{{ value2 }}</div>
    <div class="computed">{{ computedValue }}</div>
    <div class="raw-value-1">{{ rawValue1 }}</div>
    <div class="raw-value-2">{{ rawValue2.key }}</div>
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
    <button
      class="button4"
      @click="increaseRawValue1"
    >
      Increase rawValue1
    </button>
    <button
      class="button5"
      @click="increaseRawValue2Key"
    >
      Increase rawValue2.key
    </button>
  </div>
</template>
<script>
import { Component, toVue, Raw } from '../../src';

@Component({
  name: 'Hello',
})
class HelloPageWithRaw {
  message = 'No Message';

  value1 = 1;

  value2 = 2

  @Raw
  rawValue1 = 3;

  @Raw
  rawValue2 = {
    key: 4,
  };

  constructor() {
    this.value1 = 10;
    this.rawValue1 = 12;
    this.rawValue2.key = 13;
  }

  get computedValue() {
    return this.value1 + this.value2 + this.rawValue1 + this.rawValue2.key;
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

  increaseRawValue1() {
    console.log('HelloPage.increaseRawValue1');
    console.log('this:', this);
    this.rawValue1++;
  }

  increaseRawValue2Key() {
    console.log('HelloPage.increaseRawValue2Key');
    console.log('this:', this);
    this.rawValue2.key++;
  }

  setMessage(s) {
    this.message = s;
  }
}

export default toVue(HelloPageWithRaw);
</script>
