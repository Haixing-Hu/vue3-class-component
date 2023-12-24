////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import addProp from './impl/add-prop';
import createDecorator from '../create-decorator';

/**
 * The factory of the `@VModel` decorator.
 *
 * @param {object} args
 *     the optional arguments of the `@VModel` decorator.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {any} target
 *     the decorated target. Since the `@VModel` decorator is used to decorate a
 *     class field, this argument is always `undefined`.
 * @param {object} context
 *     the context about the information of the field to be decorated.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 * @see [Component v-model](https://vuejs.org/guide/components/v-model.html#component-v-model)
 */
function VModelFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new SyntaxError('The @VModel decorator can only be used to decorate a class field.');
  }
  // check whether there is already a @VModel decorated field
  if (options.emits && options.emits.includes('update:modelValue')) {
    throw new SyntaxError('Only one field can be decorated by @VModel.');
  }
  // check whether there is a data field named with 'modelValue'
  if ((options.fields) && (options.fields['modelValue'] !== undefined)) {
     throw new SyntaxError('The special name "modelValue" cannot be used as data field name.');
  }
  // check whether there is a method named with 'modelValue'
  if ((options.methods) && (options.methods['modelValue'] !== undefined)) {
    throw new SyntaxError('The special name "modelValue" cannot be used as class method name.');
  }
  // add Prop `modelValue` with the arguments of the field decorated by @VModel
  addProp(args, Class, defaultInstance, context.name, 'modelValue', options);
  // add emits: 'update:modelValue'
  options.emits ??= [];
  options.emits.push('update:modelValue');
  // add computed value with the name of the decorated field
  options.computed ??= {};
  options.computed[context.name] = {
    get() {
      return this.modelValue;
    },
    set(value) {
      this.$emit('update:modelValue', value);
    },
  };
}

/**
 * The `@VModel` decorator is marked on class fields to declare v-model bounded
 * props of the Vue component.
 *
 * See [Component v-model](https://vuejs.org/guide/components/v-model.html#component-v-model)
 * for more details about the `v-model` binding.
 *
 * The decorator may be used with an optional argument. The argument is an
 * object containing the following options of the decorator:
 *
 * | Option      | Type       | Default     | Description                                                        |
 * |-------------|------------|-------------|--------------------------------------------------------------------|
 * | `type`      | `Function` | `undefined` | The data type of the prop, which should be a constructor function. |
 * | `required`  | `Boolean`  | `false`     | Indicates whether the prop is required or not.                     |
 * | `default`   | `any`      | `undefined` | Specifies the default value of the prop.                           |
 * | `validator` | `Function` | `undefined` | A custom validation function for the prop.                         |
 *
 * Usage example:
 * ```vue
 * <template>
 *   <div class="my-component">
 *     <input v-model="message" />
 *   </div>
 * </template>
 * <script>
 * import { Component, VModel, toVue } from '&#064;haixing_hu/vue3-class-component';
 * &#064;Component
 * class MyComponent {
 *   &#064;VModel({ type: String, validator: (v) => (v.length >= 0) })
 *   message;
 * }
 *
 * export default toVue(MyComponent);
 * </script>
 * ```
 *
 * @param {...any} args
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
 * @see Prop
 * @see [Component v-model](https://vuejs.org/guide/components/v-model.html#component-v-model)
 */
function VModel(...args) {
  if (args.length === 1) {        // the decorator is used with options
    // returns a simple field decorator
    const factory = VModelFactory.bind(null, args[0]);
    return createDecorator(factory);
  } else if (args.length === 2) { // the decorator is used without options
    const factory = VModelFactory.bind(null, {});
    const decor = createDecorator(factory);
    return decor(args[0], args[1]);
  } else {
    throw new SyntaxError('Invalid use of the `@VModel` decorator.');
  }
}

export default VModel;
