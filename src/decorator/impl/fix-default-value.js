////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Fix the default value.
 *
 * Note that according to the document of Vue.js, if the default value of a Prop
 * or an injected property is an Object or an Array, it must be defined with a
 * factory function which returns the default value.
 *
 * See <a href="https://vuejs.org/api/options-state.html#props">Props</a> and
 * <a href="https://vuejs.org/api/options-composition.html#inject">Inject</a>
 * for details.
 *
 * @param {any} value
 *     the inferred default value.
 * @return {any | Function}
 * @see <a href="https://vuejs.org/api/options-state.html#props">Props</a>
 * @see <a href="https://vuejs.org/api/options-composition.html#inject">Inject</a>
 * @author Haixing Hu
 * @private
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

export default fixDefaultValue;
