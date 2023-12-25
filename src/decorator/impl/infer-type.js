////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Infers the type of a `Prop` from the inferred default value of the `Prop`.
 *
 * @param {function | undefined} type
 *     The type of the decorated field specified in the arguments `type` of the
 *     `@Prop` decorator, which could be `undefined` if no `type` argument
 *     specified.
 * @param {any | undefined} defaultValue
 *     the inferred default value of the decorated field.
 * @param {string} field
 *     the name of the field to be decorated.
 * @return {function | undefined}
 *     the inferred type of the decorated field.
 * @author Haixing Hu
 * @private
 */
function inferType(type, defaultValue, field) {
  const defaultType = defaultValue?.constructor;
  if (type === undefined) {
    type = defaultType;
  }
  if (type === undefined || type === null) {
    throw new TypeError(`The type of the field "${field}" is not specified.`);
  }
  let typeValid = false;
  let typeMismatch = false;
  if (typeof type === 'function') {
    typeValid = true;
    typeMismatch = (defaultType && type !== defaultType);
  } else if (Array.isArray(type)) {
    typeValid = type.every((v) => (typeof v === 'function'));
    typeMismatch = (defaultType && !type.includes(defaultType));
  }
  if (!typeValid) {
    throw new TypeError(`The type of the field "${field}" `
      + 'must be a constructor function or an array of constructor functions.');
  }
  if (typeMismatch) {
    throw new TypeError(`The type of the default value of the field "${field}" is ${defaultType.name}, `
      + 'which is different from the type specified in arguments of the decorator.');
  }
  return type;
}

export default inferType;
