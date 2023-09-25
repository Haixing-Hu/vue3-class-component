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

function collectVueLifecycleHook(Class, key, options) {
  if (VUE_LIFECYCLE_HOOKS.includes(key)) {
    options[key] = Class.prototype[key];
    return true;
  } else {
    return false;
  }
}

function collectVueSpecialFunction(Class, key, options) {
  if (VUE_SPECIAL_FUNCTIONS.includes(key)) {
    options[key] = Class.prototype[key];
    return true;
  } else {
    return false;
  }
}

function collectUserDefinedMethod(Class, key, descriptor, options) {
  if (typeof descriptor.value === 'function') {
    options.methods[key] = descriptor.value;
    return true;
  } else {
    return false;
  }
}

function collectUserDefinedField(Class, key, descriptor, options) {
  if (descriptor.value !== undefined && typeof descriptor.value !== 'function') {
    // deal with typescript decorated data
    options.mixins.push({
      data() {
        return {
          [key]: descriptor.value,
        };
      }
    });
    return true;
  }
  return false;
}

function collectComputedProperty(Class, key, descriptor, options) {
  if (descriptor.value === undefined) {
    if (descriptor.get || descriptor.set) {
      // deal with computed properties
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      };
      return true;
    }
  }
  return false;
}

export {
  collectVueLifecycleHook,
  collectVueSpecialFunction,
  collectUserDefinedMethod,
  collectUserDefinedField,
  collectComputedProperty,
};
