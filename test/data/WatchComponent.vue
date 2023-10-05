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
    <div id="person1-name">{{ person1.name }}</div>
    <div id="person1-age">{{ person1.age }}</div>
    <div id="person2-name">{{ person2.name }}</div>
    <div id="person2-age">{{ person2.age }}</div>
    <div id="value1-change-count">{{ value1ChangeCount }}</div>
    <div id="value2-change-count">{{ value2ChangeCount }}</div>
    <div id="message-change-count">{{ messageChangeCount }}</div>
    <div id="person1-change-count">{{ person1ChangeCount }}</div>
    <div id="person2-change-count">{{ person2ChangeCount }}</div>
  </div>
</template>
<script>
import { Component, toVue, Prop, Watch } from '../../index';

@Component
class WatchComponent {
  @Prop
  message = 'No Message';

  @Prop({ type: Number })
  value1;

  @Prop
  value2 = 123;

  @Prop
  person1 = {
    name: 'John',
    age: 30,
  };

  @Prop
  person2 = {
    name: 'Mike',
    age: 40,
  };

  value1ChangeCount = 0;

  value2ChangeCount = 0;

  messageChangeCount = 0;

  person1ChangeCount = 0;

  person2ChangeCount = 0;

  mounted() {
    console.log('WatchComponent.mounted: enter');
    console.log('this:', this);
    console.log('this.message:', this.message);
    console.log('this.value1:', this.value1);
    console.log('this.value2:', this.value2);
    console.log('this.person1:', this.person1);
    console.log('this.person2:', this.person2);
    console.log('WatchComponent.mounted: exit');
  }

  get computedValue() {
    return this.value1 + this.value2;
  }

  @Watch('value1')
  onValue1Changed(val, oldVal) {
    console.log('WatchComponent.onValue1Changed: enter, val = ', val, ', oldVal = ', oldVal);
    this.value1ChangeCount++;
    console.log('WatchComponent.onValue1Changed: exit');
  }

  @Watch('value2', {immediate: true})
  onValue2Changed(val, oldVal) {
    console.log('WatchComponent.onValue2Changed: enter, val = ', val, ', oldVal = ', oldVal);
    this.value2ChangeCount++;
    console.log('WatchComponent.onValue2Changed: exit');
  }

  @Watch('message')
  onMessageChanged(val, oldVal) {
    console.log('WatchComponent.onMessageChanged: enter, val = ', val, ', oldVal = ', oldVal);
    this.messageChangeCount++;
    console.log('WatchComponent.onMessageChanged: exit');
  }

  @Watch('person1')
  onPerson1Changed(val, oldVal) {
    console.log('WatchComponent.onPerson1Changed: enter, val = ', val, ', oldVal = ', oldVal);
    this.person1ChangeCount++;
    console.log('WatchComponent.onPerson1Changed: exit');
  }

  @Watch('person2', {deep : true})
  onPerson2Changed(val, oldVal) {
    console.log('WatchComponent.onPerson2Changed: enter, val = ', val, ', oldVal = ', oldVal);
    this.person2ChangeCount++;
    console.log('WatchComponent.onPerson2Changed: exit');
  }
}

export default toVue(WatchComponent);
</script>
