/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import createDecorator from "../create-decorator";

/**
 * The factory of the `@Prop` decorator.
 *
 * @param decoratorOptions
 *     the argument containing the options of the `@Prop` decorator.
 * @param target
 *     the decorated target. Since the `@Prop` decorator is used to decorate a
 *     class field, this argument is always `undefined`.
 * @param context
 *     the context about the information of the field to be decorated.
 * @param componentOptions
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 */
function PropFactory(decoratorOptions, target, context, componentOptions) {
  if (context?.kind !== 'field') {
    throw new Error('The @Prop decorator can only be used to decorate a class field.');
  }
  const type = decoratorOptions.type;
  const required = decoratorOptions.required || false;
  const defaultValue = decoratorOptions.default;
  const validator = decoratorOptions.validator;
  // infer the type
  if (type === undefined) {

  }

}

/**
 * The decorator of props of Vue components.
 *
 * This decorator must be used to decorate a class field.
 *
 * The decorator may be used with or without an argument. The argument is an
 * object containing the options of the decorator. The supported options are:
 *
 * | Option      | Type       | Default     | Description                                               |
 * |-------------|------------|-------------|-----------------------------------------------------------|
 * | `type`      | `Function` | `undefined` | The type of the prop, which should be a type constructor. |
 * | `required`  | `Boolean`  | `false`     | Whether the prop is required.                             |
 * | `default`   | `any`      | `null`      | The default value of the prop.                            |
 * | `validator` | `Function` | `undefined` | The validator function of the prop.                       |
 *
 * @param {Array} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the additional options of this decorator,
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
    throw new TypeError('Invalid use of the `@Prop` decorator.');
  }
}

export default Prop;
