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
import {DECORATORS_KEY} from "./metadata-keys";

function collectMethod(obj, key, options) {
  console.log('collectMethod: key = ', key);
  if (key === 'constructor') {
    return;
  }
  if (VUE_LIFECYCLE_HOOKS.includes(key) || VUE_SPECIAL_FUNCTIONS.includes(key)) {
    // obj[key] must be a function
    options[key] = obj[key];
  } else {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (typeof descriptor.value === 'function') {
      // deal with class methods
      options.methods[key] = descriptor.value;
    } else if (descriptor.value !== undefined) {
      // deal with typescript decorated data
      options.mixins.push({
        data() {
          return {
            [key]: descriptor.value,
          };
        }
      });
    } else if (descriptor.get || descriptor.set) {
      // deal with computed properties
      options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      };
    }
  }
}

function collectData(instance, options) {
  const entries = Object.entries(instance);
  const fields = {};
  entries.forEach(([key, value]) => {
    if (typeof value === 'function') {
      collectMethod(instance, key, options);
    } else if (value !== undefined) {
      fields[key] = value;
    }
  });
  // Add data hook to collect class properties as Vue instance's data
  options.mixins.push({
    data() {
      return fields;
    }
  });
}

function collectDecorators(Class, context, options) {
  const metadata = context.metadata;
  if (metadata[DECORATORS_KEY]) {
    for (const decorator of metadata[DECORATORS_KEY]) {
      decorator(options);
    }
  }
}

export {
  collectMethod,
  collectData,
  collectDecorators,
};
