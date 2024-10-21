////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { VUE_LIFECYCLE_HOOKS, VUE_SPECIAL_FUNCTIONS } from './vue-options-api';

/**
 * Collects a class method or setter/getter and modify the existing Vue component
 * options object.
 *
 * @param obj
 *     the object, which usually be the prototype of a class or a instance of
 *     a class.
 * @param key
 *     the name of the method or setter/getter.
 * @param options
 *     the Vue component options object.
 * @private
 * @author Haixing Hu
 */
function collectMethod(obj, key, options) {
  if (key === 'constructor') {
    return;
  }
  if (VUE_LIFECYCLE_HOOKS.includes(key) || VUE_SPECIAL_FUNCTIONS.includes(key)) {
    if (typeof obj[key] !== 'function') {
      throw new Error(`The property "${key}" of the class must be a Vue component function.`);
    }
    options[key] = obj[key];
  } else {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (typeof descriptor.value === 'function') { // deal with class methods
      options.methods[key] = descriptor.value;
    } else if (descriptor.value === undefined) {  // deal with computed properties
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      };
    } else {                                      // deal with class fields
      options.fields[key] = descriptor.value;
    }
  }
}

export default collectMethod;
