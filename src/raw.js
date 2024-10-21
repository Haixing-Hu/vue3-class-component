////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import createDecorator from './create-decorator';

/**
 * The factory of the `@MarkRaw` decorator.
 *
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
 * @private
 * @author Haixing Hu
 */
function RawFactory(Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'field') {
    throw new SyntaxError('The @Raw decorator can only be used to decorate a class field.');
  }
  const key = context.name;
  const value = options.fields[key];
  options.rawFields[key] = value;
  delete options.fields[key];     // remove the field from the reactive data fields
  options.mixins.push({
    created() {
      this[key] = options.rawFields[key];
    },
  });
}

/**
 * The `@Raw` decorator is marked on class fields to declare the field as a raw
 * field, which is not reactive.
 *
 * Usage example:
 * ```js
 * &#064;Component
 * class MyComponent {
 *
 *   message = 'hello';
 *
 *   &#064;Raw
 *   rawValue = 123;
 *
 *   &#064;Raw
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
 * The above code declares a Vue component named `MyComponent` with three fields:
 * - `message` is a reactive field with the initial value `'hello'`.
 * - `rawValue` is a non-reactive raw field with the initial value `123`.
 * - `person` is a non-reactive raw field with the initial value:
 *
 * @param {string} target
 *     The target of the decorator. Since this decorator is used to decorate a
 *     class field, the target is always `undefined`.
 * @param {object} context
 *     The context object containing information about the field being decorated.
 * @return {function|void}
 *     An initializer function which runs when the field is assigned, receiving
 *     the initial value of the field and returning a new initial value; or
 *     returns nothing.
 * @author Haixing Hu
 */
function Raw(target, context) {
  const decor = createDecorator(RawFactory);
  return decor(target, context);
}

export default Raw;
