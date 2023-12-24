<!------------------------------------------------------------------------------
  -
  -    Copyright (c) 2022 - 2023.
  -    Haixing Hu, Qubit Co. Ltd.
  -
  -    All rights reserved.
  -
  ----------------------------------------------------------------------------->
<template>
  <div class="use-v-model-component">
    <v-model-component
      v-model="message"
    />
    <div class="input-div">
      <input
        id="new-message-input"
        v-model="newMessage"
      />
    </div>
    <div class="button-div">
      <button id="button"
        @click="updateMessage"
      />
    </div>
  </div>
</template>
<script>
import { Component, toVue } from '../../src';
import VModelComponent from './VModelComponent.vue';

@Component({
  components: {
    VModelComponent,
  },
})
class UseVModelComponent {
  message = 'Here you are!';

  newMessage = '';

  updateMessage() {
    console.log('UseVModelComponent.updateMessage:', this.newMessage);
    this.message = this.newMessage;
  }
}

export default toVue(UseVModelComponent);
</script>
