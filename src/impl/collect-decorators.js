////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { DECORATORS_KEY } from './metadata-keys';

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
 * @private
 * @author Haixing Hu
 */
function collectDecorators(Class, defaultInstance, context, options) {
  const metadata = context.metadata;
  const decorators = metadata[DECORATORS_KEY];
  if (decorators) {
    for (const decorator of decorators) {
      decorator(Class, defaultInstance, options);
    }
  }
}

export default collectDecorators;
