////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { OPTIONS_KEY } from './metadata-keys';
import checkOptions from './check-options';
import collectMethods from './collect-methods';
import collectData from './collect-data';
import collectDecorators from './collect-decorators';

/**
 * Builds a Vue component from a class.
 *
 * @param {Function} Class
 *     The constructor of the class being decorated.
 * @param {Object} context
 *     The context object containing information about the class being decorated.
 * @param {Object} options
 *     The additional options of the Vue component being built.
 * @return {Function}
 *     The decorated class, which contains the metadata of the options used to
 *     build a Vue component with the options API.
 * @private
 * @author Haixing Hu
 */
function buildOptions(Class, context, options) {
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof Class !== 'function' || context.kind !== 'class') {
    throw new TypeError('The `@Component` can only decorate a class.');
  }
  if (options === null || typeof options !== 'object') {
    throw new TypeError('The options of the `@Component` decorator must be an object.');
  }
  checkOptions(options);
  // set the name of the Vue component
  options.name ??= Class.name;
  // initialize the options.methods
  options.methods ??= {};
  // initialize the options.mixins
  options.mixins ??= [];
  // initialize the options.computed
  options.computed ??= {};
  // initialize the options.fields
  options.fields ??= {};
  // initialize the options.rawFields
  options.rawFields ??= {};
  // collect the class methods defined in the Class
  collectMethods(Class, options);
  // collect the data fields defined in the Class
  const defaultInstance = new Class();
  collectData(Class, defaultInstance, options);
  // deal with customized field/method decorators
  collectDecorators(Class, defaultInstance, context, options);
  // store options in the metadata
  context.metadata[OPTIONS_KEY] = options;
  return Class;
}

export default buildOptions;
