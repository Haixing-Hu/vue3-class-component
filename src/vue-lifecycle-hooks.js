/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/

/**
 * The names of lifecycle hooks of Vue components.
 *
 * @type {string[]}
 * @see https://vuejs.org/api/options-lifecycle.html
 */
const VUE_LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeUnmount',
  'unmounted',
  'errorCaptured',
  'renderTracked',    // Dev only
  'renderTriggered',  // Dev only
  'activated',
  'deactivated',
  'serverPrefetch',   // SSR only
];

export default VUE_LIFECYCLE_HOOKS;
