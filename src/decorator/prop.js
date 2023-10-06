/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import createDecorator from '../create-decorator';
import { fixDefaultValue } from '../utils';

/**
 * Infers the default value of a Prop from the initial value of a class field.
 *
 * @param {any | undefined} defaultValue
 *     the default value of the decorated field specified in the arguments
 *     `default` of the `@Prop` decorator, which could be `undefined` if no
 *     `default` argument specified.
 * @param {any | undefined} initialValue
 *     the initial value of the decorated field specified in the default
 *     constructed instance of the class, which could be `undefined` if the
 *     field is not initialized.
 * @param {Object} context
 *     the context object containing information about the field to be decorated.
 * @return {any | undefined}
 *     the inferred default value of the decorated field.
 * @private
 * @author Haixing Hu
 */
function inferDefaultValue(defaultValue, initialValue, context) {
  if (initialValue === undefined) {
    return defaultValue;
  } else if (defaultValue === undefined) {
    return initialValue;
  } else if (defaultValue !== initialValue) {
    throw new Error(`The default value of the field "${context.name}" is `
        + 'different from the default value specified in arguments of the @Prop decorator.');
  } else {
    return defaultValue;
  }
}

/**
 * Infers the type of a Prop from the inferred default value of the Prop.
 *
 * @param {Function | undefined} type
 *     The type of the decorated field specified in the arguments `type` of the
 *     `@Prop` decorator, which could be `undefined` if no `type` argument
 *     specified.
 * @param {any | undefined} defaultValue
 *     the inferred default value of the decorated field.
 * @param {Object} context
 *     the context object containing information about the field to be decorated.
 * @return {Function | undefined}
 *     the inferred type of the decorated field.
 * @private
 * @author Haixing Hu
 */
function inferType(type, defaultValue, context) {
  if (type === undefined) {
    if (defaultValue !== undefined && defaultValue !== null) {
      return defaultValue.constructor;
    }
  } else if ((defaultValue !== undefined)
      && (defaultValue !== null)
      && (String(type) !== String(defaultValue.constructor))) {
    throw new Error(`The type of the field "${context.name}" is ${defaultValue.constructor.name}, `
        + `which is different from the type ${type.name} specified in arguments of the @Prop decorator.`);
  }
  return type;
}

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
 * @private
 * @author Haixing Hu
 */
function PropFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new Error('The @Prop decorator can only be used to decorate a class field.');
  }
  // get the initial value of the field from the default constructed instance
  const initialValue = defaultInstance[context.name];
  const defaultValue = inferDefaultValue(args.default, initialValue, context);
  const type = inferType(args.type, defaultValue, context);
  const required = args.required ?? (defaultValue === undefined);
  const validator = args.validator;
  if ((required === false) && (defaultValue === undefined)) {
    throw new Error(`The field "${context.name}" is not required, but it has no default value.`);
  }
  if (type === undefined || type === null) {
    throw new Error(`The type of the field "${context.name}" is not specified.`);
  }
  if (typeof type !== 'function') {
    throw new Error(`The type of the field "${context.name}" must be a constructor function.`);
  }
  if (validator !== undefined && typeof validator !== 'function') {
    throw new Error(`The validator of the field "${context.name}" must be a function.`);
  }
  options.props ??= {};
  options.props[context.name] = {
    type,
    required,
    default: fixDefaultValue(defaultValue),
    validator,
  };
  // remove the Prop name from the options.fields
  delete options.fields[context.name];
}

/**
 * The `@Prop` decorator is marked on class fields to declare props of the Vue
 * component.
 *
 * The decorator may be used with an optional argument. The argument is an
 * object containing the following options of the decorator:
 *
 * | Option      | Type       | Default     | Description                                               |
 * |-------------|------------|-------------|-----------------------------------------------------------|
 * | `type`      | `Function` | `undefined` | The type of the prop, which should be a type constructor. |
 * | `required`  | `Boolean`  | `false`     | Whether the prop is required.                             |
 * | `default`   | `any`      | `null`      | The default value of the prop.                            |
 * | `validator` | `Function` | `undefined` | The validator function of the prop.                       |
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
    throw new Error('Invalid use of the `@Prop` decorator.');
  }
}

export default Prop;
