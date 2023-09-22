/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import VUE_LIFECYCLE_HOOKS from './vue-lifecycle-hooks';
import VUE_SPECIAL_FUNCTIONS from './vue-special-functions';
import collectData from './collect-data';

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
  if (typeof Class !== 'function') {
    throw new TypeError('The constructor of the decorated class must be a function.');
  }
  if (context === null || typeof context !== 'object') {
    throw new TypeError('The context must be an object.');
  }
  if (context.kind !== 'class') {
    throw new TypeError('The `@Component` can only decorate a class.');
  }
  if (options === null || typeof options !== 'object') {
    throw new TypeError('The options of the `@Component` decorator must be an object.');
  }
  // set the name of the Vue component
  options.name = options.name || Class.name;
  // initialize the options.methods
  options.methods = options.methods || {};
  // initialize the options.mixins
  options.mixins = options.mixins || [];
  // initialize the options.computed
  options.computed = options.computed || {};
  const proto = Class.prototype;
  const keys = Object.getOwnPropertyNames(proto);
  for (const key of keys) {
    // ignore constructor
    if (key === 'constructor') {
      continue;
    }
    // deal with hooks
    if (VUE_LIFECYCLE_HOOKS.includes(key)) {
      options[key] = proto[key];
      continue;
    }
    // deal with special functions
    if (VUE_SPECIAL_FUNCTIONS.includes(key)) {
      options[key] = proto[key];
      continue;
    }
    // deal with other user defined methods
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor.value) {
      if (descriptor.value instanceof Function) {  // deal with user defined methods
        options.methods[key] = descriptor.value;
      } else {  // deal with typescript decorated data
        options.mixins.push({
          data() {
            return {
              [key]: descriptor.value,
            };
          }
        });
      }
    } else if (descriptor.get || descriptor.set) {
      // deal with computed properties
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      };
    }
  }
  // Add data hook to collect class properties as Vue instance's data
  options.mixins.push({
    data() {
      return collectData(this, Class);
    }
  });
  // deal with customized field/method decorators
  if (Class.__decorators__) {
    for (const decorator of Class.__decorators__) {
      decorator(options);
    }
  }

  console.log('options = ', options);
  Class.__vue_component_options__ = options;
}

export default buildComponent;
