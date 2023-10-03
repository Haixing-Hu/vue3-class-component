/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { computed } from 'vue';
import createDecorator from '../create-decorator';

/**
 * The factory of the `@Provide` decorator.
 *
 * @param {object} args
 *     the optional arguments of the `@Provide` decorator.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {any} target
 *     the decorated target. Since the `@Provide` decorator is used to decorate
 *     a class field, this argument is always `undefined`.
 * @param {object} context
 *     the context about the information of the field to be decorated.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 */
function ProvideFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new Error('The @Provide decorator can only be used to decorate a class field.');
  }
  const key = args.key ?? context.name;
  const reactive = args.reactive ?? false;
  // Add provide mixin
  if (reactive) {
    options.mixins.push({
      provide() {
        return {
          [key]: computed(() => this[context.name]),
        };
      }
    });
  } else {
    options.mixins.push({
      provide() {
        return {
          [key]: this[context.name],
        };
      }
    });
  }
}

/**
 * The `@Provide` decorator is marked on class fields to declare provided values
 * that can be injected by descendant components.
 *
 * The `@Provide` decorators may be used with an optional argument. The optional
 * argument is an object with the following options:
 *
 * | Option     | Type               | Default     | Description                              |
 * |------------|--------------------|-------------|------------------------------------------|
 * | `key`      | `String \| Symbol` | `undefined` | The key of the provided value.           |
 * | `reactive` | `Boolean`          | `false`     | Whether the provided value is reactive.  |
 *
 * @param {...} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the optional options of this decorator,
 *     and this function should return another function which is the decorator
 *     of a class field; If it has two arguments, the first argument is the
 *     decorated field of a class, and the second argument is the context object
 *     containing information about the field being decorated.
 * @return {Function}
 *     If this decorator has only one argument, this function returns another
 *     function which is the decorator of a class field; otherwise, this function
 *     returns the decorated class field.
 * @author Haixing Hu
 */
function Provide(...args) {
  if (args.length === 1) {        // the decorator is used with options
    // returns a simple field decorator
    const factory = ProvideFactory.bind(null, args[0]);
    return createDecorator(factory);
  } else if (args.length === 2) { // the decorator is used without options
    const factory = ProvideFactory.bind(null, {});
    const decor = createDecorator(factory);
    return decor(args[0], args[1]);
  } else {
    throw new TypeError('Invalid use of the `@Provide` decorator.');
  }
}

export default Provide;
