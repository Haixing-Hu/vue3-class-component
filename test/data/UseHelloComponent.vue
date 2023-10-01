<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="use-hello-component">
    <hello-component
      :message="message"
      :value1="value1"
      :value2="value2"
    />
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
  </div>
</template>
<script>
import { Component, toVue, Prop } from '../../index';
import HelloComponent from './HelloComponent.vue';

@Component({
  components: {
    HelloComponent,
  },
})
class UseHelloComponent {
  message = 'No Message';

  value1 = 123;

  constructor() {
    this.value2 = 0;
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  mounted() {
    console.log('UseHelloComponent.mounted: enter');
    console.log('this:', this);
    this.message = 'Hello World';
    console.log('UseHelloComponent.mounted: exit');
  }

  increaseValue1() {
    console.log('UseHelloComponent.increaseValue1: enter');
    console.log('this:', this);
    this.value1++;
    console.log('UseHelloComponent.increaseValue1: exit');
  }

  increaseValue2() {
    console.log('UseHelloComponent.increaseValue2: enter');
    console.log('this:', this);
    this.value2++;
    console.log('UseHelloComponent.increaseValue2: exit');
  }

  setMessage(s) {
    console.log('UseHelloComponent.setMessage: enter');
    this.message = s;
    console.log('UseHelloComponent.setMessage: exit');
  }
}

export default toVue(UseHelloComponent);
</script>
