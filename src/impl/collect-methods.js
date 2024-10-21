////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import collectMethod from './collect-method';

/**
 * Collects all the methods defined in a class.
 *
 * @param {Function} Class
 *     The constructor of the class being decorated.
 * @param {Object} options
 *     The additional options of the Vue component being built.
 * @private
 * @author Haixing Hu
 */
function collectMethods(Class, options) {
  const proto = Class.prototype;
  const keys = Object.getOwnPropertyNames(proto);
  for (const key of keys) {
    collectMethod(proto, key, options);
  }
}

export default collectMethods;
