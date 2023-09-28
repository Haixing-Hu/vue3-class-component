/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
/**
 * The list of keywords and its declaring positions in the Vue options API.
 *
 * @type Array<Object>
 * @author Haixing Hu
 */
const VUE_KEYWORDS = [
  {
    name: 'data',
    category: 'State',
    declared: 'field',
  },
  {
    name: 'props',
    category: 'State',
    declared: 'field',
    decorated: '@Prop',
  },
  {
    name: 'computed',
    category: 'State',
    declared: 'setter',
  },
  {
    name: 'methods',
    category: 'State',
    declared: 'method',
  },
  {
    name: 'watch',
    category: 'State',
    declared: 'method',
    decorated: '@Watch',
  },
  {
    name: 'emits',
    category: 'State',
    declared: 'options',
  },
  {
    name: 'expose',
    category: 'State',
    declared: 'options',
  },
  {
    name: 'template',
    category: 'Rendering',
    declared: 'options',
  },
  {
    name: 'render',
    category: 'Rendering',
    declared: 'method',
  },
  {
    name: 'compilerOptions',
    category: 'Rendering',
    declared: 'options',
  },
  {
    name: 'slots',
    category: 'Rendering',
    declared: 'options',
  },
  {
    name: 'beforeCreate',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'created',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'beforeMount',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'mounted',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'beforeUpdate',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'updated',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'beforeUnmount',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'unmounted',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'errorCaptured',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'renderTracked',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'renderTriggered',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'activated',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'deactivated',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'serverPrefetch',
    category: 'Lifecycle',
    declared: 'method',
  },
  {
    name: 'provide',
    category: 'Composition',
    declared: 'method',
  },
  {
    name: 'inject',
    category: 'Composition',
    declared: 'field',
    decorated: '@Inject',
  },
  {
    name: 'mixins',
    category: 'Composition',
    declared: 'options',
  },
  {
    name: 'extends',
    category: 'Composition',
    declared: 'options',
  },
  {
    name: 'name',
    category: 'Composition',
    declared: 'options',
  },
  {
    name: 'inheritAttrs',
    category: 'Composition',
    declared: 'options',
  },
  {
    name: 'components',
    category: 'Composition',
    declared: 'options',
  },
  {
    name: 'directives',
    category: 'Composition',
    declared: 'options',
  },
];

/**
 * The names of lifecycle hooks of Vue components.
 *
 * @type {string[]}
 * @see https://vuejs.org/api/options-lifecycle.html
 * @author Haixing Hu
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

/**
 * The names of special functions in the options API Vue components.
 *
 * @type {string[]}
 * @see https://vuejs.org/api/options-rendering.html#render
 * @author Haixing Hu
 */
const VUE_SPECIAL_FUNCTIONS = [
  'render',
];

export {
  VUE_KEYWORDS,
  VUE_LIFECYCLE_HOOKS,
  VUE_SPECIAL_FUNCTIONS,
};
