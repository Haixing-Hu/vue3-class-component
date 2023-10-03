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
 * @param options
 *     the Vue component options object.
 * @author Haixing Hu
 */
function collectMethod(obj, key, options) {
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
    } else if (descriptor.get || descriptor.set) {
      // deal with computed properties
      options.computed[key] = {
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
 * @param options
 *     the Vue component options object.
 * @author Haixing Hu
 */
function collectData(defaultInstance, options) {
  const entries = Object.entries(defaultInstance);
  options.fields = {};
  entries.forEach(([key, value]) => {
    if (typeof value === 'function') {
      collectMethod(defaultInstance, key, options);
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

/**
 * Fix the default value.
 *
 * Note that according to the document of Vue.js, if the default value of a Prop
 * or a injected property is an Object or an Array, it must be defined with a
 * factory function which returns the default value.
 * See <a href="https://vuejs.org/api/options-state.html#props">Props</a> and
 * <a href="https://vuejs.org/api/options-composition.html#inject">Inject</a>
 * for details.
 *
 * @param {any} value
 *     the inferred default value.
 * @return {any | Function}
 * @see <a href="https://vuejs.org/api/options-state.html#props">Props</a>
 * @see <a href="https://vuejs.org/api/options-composition.html#inject">Inject</a>
 */
function fixDefaultValue(value) {
  if (value === undefined) {
    return undefined;
  } else if (value === null) {
    return null;
  } else if (Array.isArray(value) || (value instanceof Object)) {
    return () => value;   // returns the factory function
  } else {
    return value;
  }
}

export {
  checkOptions,
  collectMethod,
  collectData,
  collectDecorators,
  fixDefaultValue,
};
