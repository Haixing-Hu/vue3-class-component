<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="use-prop-component">
    <prop-component
      ref="propComponent"
      :message="message"
      :value1="value1"
      :value2="value2"
      :value5="value5"
      :user="user"
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
    <button
      id="button4"
      @click="setUsername('guest')"
    >
      Change the user.username
    </button>
    <button
      id="button5"
      @click="setTotalValue(101)"
    >
      Set the totalValue
    </button>
  </div>
</template>
<script>
import { Component, toVue } from '../../src';
import PropComponent from './PropComponent.vue';
import User from './user';

@Component({
  components: {
    PropComponent,
  },
})
class UsePropComponent {
  message = 'No Message';

  value1 = 123;

  user = new User('admin', '123456');

  value5 = true;

  constructor() {
    this.value2 = 0;
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  mounted() {
    console.log('UsePropComponent.mounted: enter');
    console.log('this:', this);
    this.message = 'Hello World';
    console.log('UsePropComponent.mounted: exit');
  }

  increaseValue1() {
    console.log('UsePropComponent.increaseValue1: enter');
    console.log('this:', this);
    this.value1++;
    console.log('UsePropComponent.increaseValue1: exit');
  }

  increaseValue2() {
    console.log('UsePropComponent.increaseValue2: enter');
    console.log('this:', this);
    this.value2++;
    console.log('UsePropComponent.increaseValue2: exit');
  }

  setMessage(s) {
    console.log('UsePropComponent.setMessage: enter');
    this.message = s;
    console.log('UsePropComponent.setMessage: exit');
  }

  setUsername(username) {
    console.log('UsePropComponent.setUsername: enter');
    this.user.username = username;
    console.log('UsePropComponent.setUsername: exit');
  }

  setTotalValue(val) {
    console.log('UsePropComponent.setTotalValue: enter, val = ', val);
    const comp = this.$refs.propComponent;
    comp.totalValue = val;
    console.log('UsePropComponent.setTotalValue: exit');
  }
}

export default toVue(UsePropComponent);
</script>
