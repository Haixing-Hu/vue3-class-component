////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '@haixing_hu/clone';
import collectMethod from './collect-method';

/**
 * Collects all class fields from an instance of a class and modify the existing
 * Vue component options object.
 *
 * @param defaultInstance
 *     the default constructed instance of the decorated class.
 * @param options
 *     the Vue component options object.
 * @private
 * @author Haixing Hu
 */
function collectData(defaultInstance, options) {
  const entries = Object.entries(defaultInstance);
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
      // deep clone the fields, so that the data of the Vue instance is
      // independent of the class instance.
      return clone(options.fields);
    },
  });
}

export default collectData;
