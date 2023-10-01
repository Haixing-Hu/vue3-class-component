/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import {
  VUE_KEYWORDS,
  VUE_LIFECYCLE_HOOKS,
  VUE_SPECIAL_FUNCTIONS,
} from "./vue-options-api";
import {
  METHODS_KEY,
  COMPUTED_KEY,
  FIELDS_KEY,
  DECORATORS_KEY,
} from "./metadata-keys";

/**
 * Checks the validity of the options of the `@Component` decorator.
 *
 * @param {Object} options
 *     the options to be checked.
 * @throws Error
 *     if the options contains invalid properties.
 * @author Haixing Hu
 */
function checkOptions(options) {
  Object.keys(options).forEach((key) => {
    const keyword = VUE_KEYWORDS.find((item) => (item.name === key));
    if (!keyword) {
      throw new Error(`The option "${key}" in the argument of @Component is not supported.`);
    }
    if (keyword.declared !== 'options') {
      let msg = `The option "${key}" in the argument of @Component should be declared as the class ${keyword.declared}`;
      if (keyword.decorated) {
        msg += ` and decorated by ${keyword.decorated}`;
      }
      msg += '.';
      throw new Error(msg);
    }
  });
}

/**
 * Collects a class method or setter/getter and modify the existing Vue component
 * options object.
 *
 * @param obj
 *     the object, which usually be the prototype of a class or a instance of
 *     a class.
 * @param key
 *     the name of the method or setter/getter.
 * @param context
 *     the context of the information about the decorated class.
 * @param options
 *     the Vue component options object.
 * @author Haixing Hu
 */
function collectMethod(obj, key, context, options) {
  if (key === 'constructor') {
    return;
  }
  const metadata = context.metadata;
  metadata[METHODS_KEY] ??= {};
  const methods = metadata[METHODS_KEY];
  metadata[COMPUTED_KEY] ??= {};
  const computed = metadata[COMPUTED_KEY];
  if (VUE_LIFECYCLE_HOOKS.includes(key) || VUE_SPECIAL_FUNCTIONS.includes(key)) {
    // obj[key] must be a function
    options[key] = obj[key];
  } else {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (typeof descriptor.value === 'function') {
      // deal with class methods
      methods[key] = options.methods[key] = descriptor.value;
    } else if (descriptor.get || descriptor.set) {
      // deal with computed properties
      computed[key] = options.computed[key] = {
        get: descriptor.get,
        set: descriptor.set,
      };
    }
  }
}

/**
 * Collects all class fields from an instance of a class and modify the existing
 * Vue component options object.
 *
 * @param defaultInstance
 *     the default constructed instance of the decorated class.
 * @param context
 *     the context of the information about the decorated class.
 * @param options
 *     the Vue component options object.
 * @author Haixing Hu
 */
function collectData(defaultInstance, context, options) {
  const entries = Object.entries(defaultInstance);
  options.fields = {};
  entries.forEach(([key, value]) => {
    if (typeof value === 'function') {
      collectMethod(defaultInstance, key, context, options);
    } else if (value !== undefined) {
      options.fields[key] = value;
    }
  });
  // Add data hook to collect class properties as Vue instance's data
  options.mixins.push({
    data() {
      return options.fields;
    }
  });
}

/**
 * Collects all decorators defined in a class and modify the existing Vue
 * component options object.
 *
 * @param Class
 *     the constructor of the decorated class.
 * @param defaultInstance
 *     the default constructed instance of the decorated class.
 * @param context
 *     the context of the information about the decorated class.
 * @param options
 *     the Vue component options object.
 * @author Haixing Hu
 */
function collectDecorators(Class, defaultInstance, context, options) {
  const metadata = context.metadata;
  if (metadata[DECORATORS_KEY]) {
    for (const decorator of metadata[DECORATORS_KEY]) {
      decorator(Class, defaultInstance, options);
    }
  }
}

export {
  checkOptions,
  collectMethod,
  collectData,
  collectDecorators,
};
