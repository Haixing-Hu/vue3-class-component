/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import buildOptions from './build-options';

// FIXME: Why we should define this symbol here?
// see: https://github.com/babel/babel/blob/672b881e41228f5060bb80ea89f64315b4a1e05b/packages/babel-plugin-proposal-decorators/test/fixtures/metadata/element/exec.js
Symbol.metadata = Symbol('metadata');

/**
 * The decorator of Vue class components.
 *
 * This decorator must be used to decorate a class.
 *
 * Usage Example:
 *
 * ```vue
 * <template>
 *   <div class="hello-page">
 *     <div class="message">{{ message }}</div>
 *     <div class="computed-message">{{ computedMessage }}</div>
 *     <div class="value">{{ value }}</div>
 *     <input v-model="newMessage">
 *     <button @click="setMessage(newMessage)">Set Message</button>
 *     <my-component />
 *   </div>
 * </template>
 * <script>
 * import { Component, toVue } from 'vue3-class-component';
 * import MyComponent from './my-component.vue';
 *
 * &#064;Component({
 *   components: {
 *     MyComponent,
 *   },
 * })
 * class HelloPage {
 *   message = 'hello';
 *
 *   value = 0;
 *
 *   newMessage = '';
 *
 *   mounted() {
 *     this.value = this.$route.params.value;
 *   }
 *
 *   get computedMessage() {
 *     return this.message + '!';
 *   }
 *
 *   setMessage(s) {
 *     this.message = s;
 *   }
 * }
 *
 * export default toVue(MyComponent); // don't forget calling `toVue`
 * </script>
 * ```
 *
 * @param {...any} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the additional options of this decorator,
 *     and this function should return another function which is the decorator
 *     of a class; If it has two arguments, the first argument is the constructor
 *     of the decorated class, and the second argument is the context object
 *     containing information about the class being decorated.
 * @return {Function}
 *     If this decorator has only one argument, this function returns another
 *     function which is the decorator of a class; otherwise, this function
 *     returns the decorated class.
 * @see https://babeljs.io/docs/babel-plugin-proposal-decorators#class-decorator
 * @see https://github.com/tc39/proposal-decorators
 * @author Haixing Hu
 */
function Component(...args) {
  // console.log('Component: args = ', args);
  if (args.length === 1) {        // the decorator is used with options
    // returns a simple class decorator
    return (Class, context) => buildOptions(Class, context, args[0]);
  } else if (args.length === 2) { // the decorator is used without options
    return buildOptions(args[0], args[1], {});
  } else {
    throw new TypeError('Invalid use of the `@Component` decorator.');
  }
}

export default Component;
