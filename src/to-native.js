/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import { defineComponent } from 'vue';
import { OPTIONS_KEY } from "./metadata-keys";

/**
 * Converts a Vue class component into the Vue component option.
 *
 * @param Class
 *     The class.
 * @returns {Object}
 *     The corresponding Vue component option.
 */
function toNative(Class) {
  const metadata = Class[Symbol.metadata];
  const options = metadata[OPTIONS_KEY];
  return defineComponent(options);
}

export default toNative;
