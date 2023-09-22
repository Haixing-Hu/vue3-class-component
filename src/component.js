/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import buildComponent from './build-component';

/**
 * The decorator of Vue class components.
 *
 * @param {Array} args
 *     The array of arguments for calling this decorator. If it has only one
 *     argument, the only argument is the additional options of this decorator,
 *     and this function should return another function which is the decorator
 *     a class; If it has two arguments, the first argument is the constructor
 *     of the decorated class, and the second argument is the context object
 *     containing information about the class being decorated.
 * @return {Function}
 *     If this decorator has only one argument, this function returns another
 *     function which is the decorator of a class; otherwise, this function
 *     returns a decorated class.
 * @see https://babeljs.io/docs/babel-plugin-proposal-decorators#class-decorator
 * @see https://github.com/tc39/proposal-decorators
 * @author Haixing Hu
 */
function Component(...args) {
  if (args.length === 1) {        // the decorator is used additional options
    // returns a simple class decorator
    return function decorator(Class, context) {
      return buildComponent(Class, context, args[0]);
    }
  } else if (args.length === 2) { // the decorator is used without additional options
    return buildComponent(args[0], args[1], {});
  } else {
    throw new TypeError('Invalid use of the `@Component` decorator.');
  }
}

export default Component;
