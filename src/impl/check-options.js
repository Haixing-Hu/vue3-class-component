////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { VUE_KEYWORDS } from './vue-options-api';

/**
 * Checks the validity of the options of the `@Component` decorator.
 *
 * @param {Object} options
 *     the options to be checked.
 * @throws Error
 *     if the options contains invalid properties.
 * @private
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

export default checkOptions;
