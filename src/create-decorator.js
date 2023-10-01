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
 * @param {Function} factory
 *    A callback function which receives the following arguments:
 *    - `Class`: The constructor of the decorated class.
 *    - `defaultInstance`: The default constructed instance of the decorated class.
 *    - `target`: The target value being decorated, which could be a class method,
 *       a getter or a setter. Note that if the decorated target is a class field,
 *       this argument will always be `undefined`.
 *    - `context`: The context object containing information about the target
 *      being decorated.
 *    - `options`: Vue component options object. Changes for this object
 *       will affect the provided component.
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
    throw new TypeError('The first argument must be a function.');
  }
  return (target, context) => {
    const metadata = context.metadata;
    metadata[DECORATORS_KEY] ??= [];
    metadata[DECORATORS_KEY].push(
        (Class, defaultInstance, options) => factory(Class, defaultInstance, target, context, options)
    );
  };
}

export default createDecorator;
