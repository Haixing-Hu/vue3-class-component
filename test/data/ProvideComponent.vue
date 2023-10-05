<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="provide-component">
    <div id="message">{{ message }}</div>
    <div id="value1">{{ value1 }}</div>
    <div id="value2">{{ value2 }}</div>
    <div id="person-name">{{ person.name }}</div>
    <div id="person-age">{{ person.age }}</div>

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
        @click="setPersonAge(100)"
    >
      Change person's age
    </button>
    <button
        id="button5"
        @click="setPerson({name: 'John_2', age: 200})"
    >
      Change person
    </button>
    <inject-component />
  </div>
</template>
<script>
import { Component, toVue, Provide } from '../../index';
import myInjectedKey from './inject-key-symbol';
import InjectComponent from './InjectComponent';

@Component({
  components: {
    InjectComponent,
  },
})
class ProvideComponent {
  @Provide
  message = 'Hello World';

  @Provide({ key: 'myValue' })
  value1 = 123;

  @Provide({ key: myInjectedKey, reactive: true })
  value2 = 456;

  @Provide({ reactive: true })
  person = {
    name: 'John',
    age: 32,
  };

  mounted() {
    console.log('ProvideComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.value1:', this.value1);
    console.log('this.value2:', this.value2);
    console.log('this.person:', this.person);
    console.log('ProvideComponent.mounted: exit');
  }

  increaseValue1() {
    console.log('ProvideComponent.increaseValue1: enter');
    console.log('this:', this);
    this.value1++;
    console.log('ProvideComponent.increaseValue1: exit');
  }

  increaseValue2() {
    console.log('ProvideComponent.increaseValue2: enter');
    console.log('this:', this);
    this.value2++;
    console.log('ProvideComponent.increaseValue2: exit');
  }

  setMessage(s) {
    console.log('ProvideComponent.setMessage: enter');
    this.message = s;
    console.log('ProvideComponent.setMessage: exit');
  }

  setPersonAge(age) {
    console.log('ProvideComponent.setPersonAge: enter');
    this.person.age = age;
    console.log('ProvideComponent.setPersonAge: exit');
  }

  setPerson(person) {
    console.log('ProvideComponent.setPerson: enter');
    this.person = person;
    console.log('ProvideComponent.setPerson: exit');
  }
}

export default toVue(ProvideComponent);
</script>
