////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Infers the default value of a Prop from the initial value of a class field.
 *
 * @param {any | undefined} defaultValue
 *     the default value of the decorated field specified in the arguments
 *     `default` of the `@Prop` decorator, which could be `undefined` if no
 *     `default` argument specified.
 * @param {any | undefined} initialValue
 *     the initial value of the decorated field specified in the default
 *     constructed instance of the class, which could be `undefined` if the
 *     field is not initialized.
 * @param {string} field
 *     the name of the field to be decorated.
 * @return {any | undefined}
 *     the inferred default value of the decorated field.
 * @author Haixing Hu
 * @private
 */
function inferDefaultValue(defaultValue, initialValue, field) {
  if (initialValue === undefined) {
    return defaultValue;
  } else if (defaultValue === undefined) {
    return initialValue;
  } else if (defaultValue !== initialValue) {
    throw new SyntaxError(`The default value of the field "${field}" is `
      + 'different from the default value specified in arguments of the decorator.');
  } else {
    return defaultValue;
  }
}

export default inferDefaultValue;
