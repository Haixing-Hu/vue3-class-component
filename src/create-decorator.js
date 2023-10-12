/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { DECORATORS_KEY } from './metadata-keys';

/**
 * Creates a customized decorator to extends the functionality of this library.
 *
 *
 * An example usage is as follows:
 *
 * ```js
 * const Log = createDecorator((Class, defaultInstance, target, context, options) => {
 *   if (context?.kind !== 'method') {
 *     throw new Error('The @Log decorator can only be used to decorate a class method.');
 *   }
 *   const methodName = context.name;
 *   const originalMethod = options.methods[methodName];
 *   options.methods[methodName] = function (...args) {
 *     console.log(`${Class.name}.${methodName}: ${args.join(', ')}`);
 *     return originalMethod.apply(this, args);
 *   };
 * });
 * ```
 *
 * The above example creates a `@Log` decorator which can be used to log the
 * arguments of a class method. For example:
 * ```js
 * &#064;Component
 * class HelloPage {
 *   message = 'hello';
 *
 *   value = 0;
 *
 *   newMessage = '';
 *
 *   &#064;Log
 *   mounted() {
 *     this.value = this.$route.params.value;
 *   }
 *
 *   get computedMessage() {
 *     return this.message + '!';
 *   }
 *
 *   &#064;Log
 *   setMessage(s) {
 *     this.message = s;
 *   }
 * }
 *
 * export default toVue(MyComponent);
 * ```
 *
 * @param {Function} factory
 *    A callback function which receives the following arguments:
 *    - `Class`: The constructor of the decorated class.
 *    - `instance`: The default constructed instance of the decorated class.
 *      This default instance could be used to gets all class instance fields of
 *      the decorated class.
 *    - `target`: The target value being decorated, which could be a class method,
 *      a getter or a setter. Note that if the decorated target is a class field,
 *      this argument will always be `undefined`.
 *    - `context`: The context object containing information about the target
 *      being decorated, as described in "stage 3 proposal of JavaScript decorators"
 *      and "stage 3 proposal of JavaScript decorator metadata".
 *    - `options`: The Vue component options object. Changes to this object will
 *      impact the provided component. This object encompasses all the properties
 *      that a Vue component options object should possess, and it includes an
 *      additional property, `fields`, which is an object containing all the
 *      reactive states of the Vue component. In other words, it's the object
 *      returned by the `data()` function of the Vue component. Modifying the
 *      `fields` property of `options` allows you to alter the reactive states
 *      returned by the Vue component's `data()` function.
 * @return {Function}
 *    The customized decorator function, which takes two arguments:
 *    - `target`: The target value being decorated, which could be class method,
 *      class field, getter or setter.
 *    - `context`: The context object containing information about the target
 *      being decorated.
 * @see https://github.com/tc39/proposal-decorators
 * @see https://github.com/tc39/proposal-decorator-metadata
 * @author Haixing Hu
 */
function createDecorator(factory) {
  if (typeof factory !== 'function') {
    throw new TypeError('The argument of `createDecorator()` must be a function.');
  }
  return (target, context) => {
    const metadata = context.metadata;
    metadata[DECORATORS_KEY] ??= [];
    metadata[DECORATORS_KEY].push(
      (Class, instance, options) => factory(Class, instance, target, context, options),
    );
  };
}

export default createDecorator;
