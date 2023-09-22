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
 *    - `target`: The target value being decorated, which could be class method,
 *      class field, getter or setter.
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
 * @author Haixing Hu
 */
function createDecorator(factory) {
  if (typeof factory !== 'function') {
    throw new TypeError('The first argument must be a function.');
  }
  return (target, context) => {


    ctor[DECORATORS_KEY].push((options) => factory(target, context, options));
  }
}

export default createDecorator;
