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
 * The factory of the `@Prop` decorator.
 *
 * @param {object} args
 *     the optional arguments of the `@Prop` decorator.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {any} target
 *     the decorated target. Since the `@Prop` decorator is used to decorate a
 *     class field, this argument is always `undefined`.
 * @param {object} context
 *     the context about the information of the field to be decorated.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 */
function PropFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new SyntaxError('The @Prop decorator can only be used to decorate a class field.');
  }
  addProp(args, Class, defaultInstance, context.name, context.name, options);
}

/**
 * The `@Prop` decorator is marked on class fields to declare props of the Vue
 * component.
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
 * ```js
 * &#064;Component
 * class MyComponent {
 *   &#064;Prop
 *   message = 'hello';
 *
 *   &#064;Prop({ type: Number, validator: (v) => (v >= 0) })
 *   value;
 *
 *   // non-primitive default value DO NOT need to be wrapped by a factory function
 *   &#064;Prop
 *   person = {
 *     id: 1,
 *     name: 'John',
 *     age: 32,
 *     gender: 'MALE',
 *   };
 * }
 *
 * export default toVue(MyComponent);
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
 */
function Prop(...args) {
  if (args.length === 1) {        // the decorator is used with options
    // returns a simple field decorator
    const factory = PropFactory.bind(null, args[0]);
    return createDecorator(factory);
  } else if (args.length === 2) { // the decorator is used without options
    const factory = PropFactory.bind(null, {});
    const decor = createDecorator(factory);
    return decor(args[0], args[1]);
  } else {
    throw new SyntaxError('Invalid use of the `@Prop` decorator.');
  }
}

export default Prop;
