////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import inferDefaultValue from './infer-default-value';
import inferType from './infer-type';
import fixDefaultValue from './fix-default-value';

/**
 * Adds a `Prop` to the Vue component options object.
 *
 * @param {object} args
 *     the optional arguments of the decorator, which contains the configuration
 *     of the new `Prop`.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {string} field
 *     the name of the field to be decorated.
 * @param {string} prop
 *     the name of the `Prop` to be added, which may differ from `field`.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 * @private
 */
function addProp(args, Class, defaultInstance, field, prop, options) {
  // get the initial value of the field from the default constructed instance
  const initialValue = defaultInstance[field];
  const defaultValue = inferDefaultValue(args.default, initialValue, field);
  const type = inferType(args.type, defaultValue, field);
  const required = args.required ?? (defaultValue === undefined);
  const validator = args.validator;
  if ((required === false) && (defaultValue === undefined)) {
    throw new SyntaxError(`The field "${field}" is not required, but it has no default value.`);
  }
  if (type === undefined || type === null) {
    throw new TypeError(`The type of the field "${field}" is not specified.`);
  }
  if (typeof type !== 'function') {
    throw new TypeError(`The type of the field "${field}" must be a constructor function.`);
  }
  if (validator !== undefined && typeof validator !== 'function') {
    throw new TypeError(`The validator of the field "${field}" must be a function.`);
  }
  options.props ??= {};
  options.props[prop] = {
    type,
    required,
    default: fixDefaultValue(defaultValue),
    validator,
  };
  // remove the field from the options.fields
  delete options.fields[field];
}

export default addProp;
