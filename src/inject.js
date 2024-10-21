////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createDecorator from './create-decorator';
import fixDefaultValue from './impl/decorator/fix-default-value';

/**
 * The factory of the `@Inject` decorator.
 *
 * @param {object} args
 *     the optional arguments of the `@Inject` decorator.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {any} target
 *     the decorated target. Since the `@Inject` decorator is used to decorate
 *     a class field, this argument is always `undefined`.
 * @param {object} context
 *     the context about the information of the field to be decorated.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @private
 * @author Haixing Hu
 */
function InjectFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new SyntaxError('The @Inject decorator can only be used to decorate a class field.');
  }
  const key = context.name;
  const from = args.from ?? key;
  const defaultValue = args.default;
  // Add inject
  options.inject ??= {};
  options.inject[key] = {
    from,
    default: fixDefaultValue(defaultValue),
  };
}

/**
 * The `@Inject` decorator is marked on class fields to declare injected values.
 *
 * The `@Inject` decorators may have an optional argument. The optional argument
 * is an object with the following options:
 *
 * | Option    | Type               | Default     | Description                                          |
 * |-----------|--------------------|-------------|------------------------------------------------------|
 * | `from`    | `String \| Symbol` | `undefined` | The key of the source provided value to be injected. |
 * | `default` | `any`              | `undefined` | The default value of the injected value.             |
 *
 * Usage example:
 * ```js
 * &#064;Component
 * class DescendantComponent {
 *   &#064;Inject
 *   message;
 *
 *   &#064;Inject({from: myInjectedKey, default: 0})
 *   injectedValue;
 *
 *   // non-primitive default value DO NOT need to be wrapped by a factory function
 *   &#064;Inject({ default: {id: 0, name: 'unknown'} })
 *   person;
 * }
 *
 * export default toVue(DescendantComponent);
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
function Inject(...args) {
  if (args.length === 1) {        // the decorator is used with options
    // returns a simple field decorator
    const factory = InjectFactory.bind(null, args[0]);
    return createDecorator(factory);
  } else if (args.length === 2) { // the decorator is used without options
    const factory = InjectFactory.bind(null, {});
    const decor = createDecorator(factory);
    return decor(args[0], args[1]);
  } else {
    throw new SyntaxError('Invalid use of the `@Inject` decorator.');
  }
}

export default Inject;
