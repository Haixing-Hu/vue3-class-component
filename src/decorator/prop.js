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
 * Infers the default value of a Prop from the initial value of a class field.
 *
 * @param {Any | undefined} defaultValue
 *     the default value of the decorated field specified in the arguments
 *     `default` of the `@Prop` decorator, which could be `undefined` if no
 *     `default` argument specified.
 * @param {Any | undefined} initialValue
 *     the initial value of the decorated field specified in the default
 *     constructed instance of the class, which could be `undefined` if the
 *     field is not initialized.
 * @param {Object} context
 *     the context object containing information about the field to be decorated.
 * @return {Any | undefined}
 *     the inferred default value of the decorated field.
 */
function inferDefaultValue(defaultValue, initialValue, context) {
  if (initialValue === undefined) {
    return defaultValue;
  } else if (defaultValue === undefined) {
    return initialValue;
  } else if (defaultValue !== initialValue) {
    throw new Error(`The default value of the field "${context.name}" is 
        different from the defaultValue specified in arguments of the @Prop decorator.`);
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
 * @param {Any | undefined} defaultValue
 *     the inferred default value of the decorated field.
 * @param {Object} context
 *     the context object containing information about the field to be decorated.
 * @return {Function | undefined}
 *     the inferred type of the decorated field.
 */
function inferType(type, defaultValue, context) {
  if (type === undefined) {
    if (defaultValue !== undefined && defaultValue !== null) {
      return defaultValue.constructor;
    }
  } else if ((defaultValue !== undefined)
      && (defaultValue !== null)
      && (String(type) !== String(defaultValue.constructor))) {
    throw new Error(`The type of the field "${context.name}" is ${defaultValue.constructor},
        which is different from the type ${type} specified in arguments of the @Prop decorator.`);
  }
  return type;
}

/**
 * Fix the inferred default value of a Prop.
 *
 * Note that according to the document of Vue.js, if the default value of a Prop
 * is an Object or an Array, it must be defined with a factory function which
 * returns the default value.
 * See <a href="https://vuejs.org/api/options-state.html#props">Props</a> for details.
 *
 * @param {Any} value
 *     the inferred default value.
 * @return {Any | Function}
 * @see https://vuejs.org/api/options-state.html#props
 */
function fixDefaultValue(value) {
  if (Array.isArray(value) || (value instanceof Object)) {
    return () => value;   // returns the factory function
  } else {
    return value;
  }
}

/**
 * The factory of the `@Prop` decorator.
 *
 * @param args
 *     the optional arguments of the `@Prop` decorator.
 * @param Class
 *     The constructor of the decorated class.
 * @param defaultInstance
 *     The default constructed instance of the decorated class.
 * @param target
 *     the decorated target. Since the `@Prop` decorator is used to decorate a
 *     class field, this argument is always `undefined`.
 * @param context
 *     the context about the information of the field to be decorated.
 * @param options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
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
  const required = args.required || (defaultValue === undefined);
  const validator = args.validator;
  if ((required === false) && (defaultValue === undefined)) {
    throw new Error(`The field "${context.name}" is not required, but it has no default value.`);
  }
  if (type === undefined || type === null) {
    throw new Error(`The type of the field "${context.name}" is not specified.`);
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
  if (options.fields[context.name]) {
    // remove the Prop name from the options.fields
    delete options.fields[context.name];
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
 * @param {...} args
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
