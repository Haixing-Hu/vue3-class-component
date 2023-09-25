/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { DECORATORS_KEY, OPTIONS_KEY } from './metadata-keys';
import collectData from './collect-data';
import {
  collectVueLifecycleHook,
  collectVueSpecialFunction,
  collectUserDefinedMethod,
  collectUserDefinedField,
  collectComputedProperty,
} from "./utils";

/**
 * Builds a Vue component from a class.
 *
 * @param {Array} Class
 *     The constructor of the class being decorated.
 * @param {Object} context
 *     The context object containing information about the class being decorated.
 * @param {Object} options
 *     The additional options of the Vue component being built.
 * @return {Function}
 *     The decorated class, which contains the metadata of the options used to
 *     build a Vue component with the options API.
 */
function buildComponent(Class, context, options) {
  console.log('Class = ', Class, 'context = ', context, 'options = ', options);
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (typeof Class !== 'function' || context.kind !== 'class') {
    throw new TypeError('The `@Component` can only decorate a class.');
  }
  if (options === null || typeof options !== 'object') {
    throw new TypeError('The options of the `@Component` decorator must be an object.');
  }
  // set the name of the Vue component
  options.name ??= Class.name;
  // initialize the options.methods
  options.methods ??= {};
  // initialize the options.mixins
  options.mixins ??= [];
  // initialize the options.computed
  options.computed ??= {};
  const proto = Class.prototype;
  const keys = Object.getOwnPropertyNames(proto);
  for (const key of keys) {
    if (key === 'constructor') {    // ignore constructor
      continue;
    }
    if (collectVueLifecycleHook(Class, key, options)) {
      continue;
    }
    if (collectVueSpecialFunction(Class, key, options)) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (collectUserDefinedMethod(Class, key, descriptor, options)) {
      continue;
    }
    if (collectUserDefinedField(Class, key, descriptor, options)) {
      continue;
    }
    collectComputedProperty(Class, key, descriptor, options);
  }
  // Add data hook to collect class properties as Vue instance's data
  options.mixins.push({
    data() {
      return collectData(this, Class);
    }
  });
  // deal with customized field/method decorators
  const metadata = context.metadata;
  if (metadata[DECORATORS_KEY]) {
    for (const decorator of metadata[DECORATORS_KEY]) {
      decorator(options);
    }
  }
  console.log('options = ', options);
  metadata[OPTIONS_KEY] = options;
  console.log('metadata = ', metadata);
}

export default buildComponent;
