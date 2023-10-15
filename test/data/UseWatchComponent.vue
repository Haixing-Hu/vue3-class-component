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
    <watch-component
      :message="message"
      :value1="value1"
      :value2="value2"
      :person1="person1"
      :person2="person2"
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
        @click="setPerson1Age(100)"
    >
      Change person1's age
    </button>
    <button
        id="button5"
        @click="setPerson1({name: 'John_2', age: 200})"
    >
      Change person1
    </button>
    <button
        id="button6"
        @click="setPerson2Age(100)"
    >
      Change person2's age
    </button>
    <button
        id="button7"
        @click="setPerson2({name: 'Mike_2', age: 200})"
    >
      Change person2
    </button>
  </div>
</template>
<script>
import { Component, toVue } from '../../src';
import WatchComponent from './WatchComponent.vue';

@Component({
  components: {
    WatchComponent,
  },
})
class UseWatchComponent {
  message = 'No Message';

  value1 = 123;

  person1 = {
    name: 'John_1',
    age: 40,
  };

  person2 = {
    name: 'Mike_1',
    age: 50,
  };

  constructor() {
    this.value2 = 0;
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  mounted() {
    console.log('UseWatchComponent.mounted: enter');
    console.log('this:', this);
    this.message = 'Hello World';
    console.log('UseWatchComponent.mounted: exit');
  }

  increaseValue1() {
    console.log('UseWatchComponent.increaseValue1: enter');
    console.log('this:', this);
    this.value1++;
    console.log('UseWatchComponent.increaseValue1: exit');
  }

  increaseValue2() {
    console.log('UseWatchComponent.increaseValue2: enter');
    console.log('this:', this);
    this.value2++;
    console.log('UseWatchComponent.increaseValue2: exit');
  }

  setMessage(s) {
    console.log('UseWatchComponent.setMessage: enter');
    this.message = s;
    console.log('UseWatchComponent.setMessage: exit');
  }

  setPerson1Age(age) {
    console.log('UseWatchComponent.setPerson1Age: enter');
    this.person1.age = age;
    console.log('UseWatchComponent.setPerson1Age: exit');
  }

  setPerson1(person) {
    console.log('UseWatchComponent.setPerson1: enter');
    this.person1 = person;
    console.log('UseWatchComponent.setPerson1: exit');
  }

  setPerson2Age(age) {
    console.log('UseWatchComponent.setPerson2Age: enter');
    this.person2.age = age;
    console.log('UseWatchComponent.setPerson2Age: exit');
  }

  setPerson2(person) {
    console.log('UseWatchComponent.setPerson2: enter');
    this.person2 = person;
    console.log('UseWatchComponent.setPerson2: exit');
  }
}

export default toVue(UseWatchComponent);
</script>
