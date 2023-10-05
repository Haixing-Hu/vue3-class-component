/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
import createDecorator from '../create-decorator';

/**
 * The factory of the `@Watch` decorator.
 *
 * @param {object} args
 *     the arguments of the `@Watch` decorator.
 * @param {function} Class
 *     The constructor of the decorated class.
 * @param {object} defaultInstance
 *     The default constructed instance of the decorated class.
 * @param {any} target
 *     the decorated target. Since the `@Watch` decorator is used to decorate a
 *     class method, this argument is the class method to be decorated.
 * @param {object} context
 *     the context about the information of the method to be decorated.
 * @param {object} options
 *     the Vue component options object. Changes for this object will affect the
 *     provided component.
 * @author Haixing Hu
 */
function WatchFactory(args, Class, defaultInstance, target, context, options) {
  if (context?.kind !== 'method') {
    throw new Error('The @Watch decorator can only be used to decorate a class method.');
  }
  const path = args.path;
  const deep = args.deep ?? false;
  const immediate = args.immediate ?? false;
  const flush = args.flush ?? 'pre';
  options.watch ??= {};
  if (options.watch[path] !== undefined) {
    throw new Error(`The @Watch decorator can only be used once on the path "${path}".`);
  }
  options.watch[path] = {
    handler: target,
    deep,
    immediate,
    flush,
  };
  // delete the handler method from options.methods
  delete options.methods[context.name];
}

/**
 * The `@Watch` decorator is marked on class methods to declare watchers of the
 * Vue component.
 *
 * The `@Watch` decorator has one or two arguments. The first argument of the
 * `@Watch` decorator is the path of the watched states or watched properties.
 * The second optional argument of the `@Watch` decorator is an object with the
 * following options:
 *
 * | Option      | Type      | Default | Description                                                                             |
 * |-------------|-----------|---------|-----------------------------------------------------------------------------------------|
 * | `deep`      | `Boolean` | `false` | Whether the watcher should deep traversal of the source if it is an object or an array. |
 * | `immediate` | `Boolean` | `false` | Whether the watcher should be called immediately after the watcher is created.          |
 * | `flush`     | `String`  | `'pre'` | The flushing timing of the watcher. It can be one of `'pre'`, `'post'` or `'sync'`.     |
 *
 * @param {string} path
 *     The path of the watched states or watched properties.
 * @param {object} options
 *     The optional options of the `@Watch` decorator.
 * @return {Function}
 *     The decorator of a class method.
 * @author Haixing Hu
 */
function Watch(path, options = {}) {
  if (typeof path !== 'string') {
    throw new TypeError('The path argument of `@Watch` decorator must be a string.');
  }
  const args = {
    path,
    ...options,
  };
  const factory = WatchFactory.bind(null, args);
  return createDecorator(factory);
}

export default Watch;
