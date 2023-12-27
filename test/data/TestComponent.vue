
<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="test-component">
    <div class="message">{{ message }}</div>
    <div class="data">{{ JSON.stringify(data) }}</div>
    <button
      class="button1"
      @click="setMessage('Changed')"
    >
      Change the message
    </button>
    <button
      class="button2"
      @click="setData(0, 2)"
    >
      Change the data array
    </button>
  </div>
</template>
<script>
import { Component, toVue } from '../../src';

@Component
class TestComponent {
  message = 'Hello World';

  data = [1, 2, 3];

  constructor() {
    this.value2 = 0;
  }

  setMessage(s) {
    this.message = s;
  }

  setData(index, value) {
    this.data[index] = value;
    // console.log('this:', this);
    // console.log('this.data:', this.data);
  }
}

export default toVue(TestComponent);
</script>
