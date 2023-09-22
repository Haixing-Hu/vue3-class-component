# vue3-class-component

This library lets you make your [Vue] components in the class-style syntax. 
It's heavily inspired by [vue-class-component], except that:
- It supports [Vue] v3.x.x (currently v3.3.4);
- It's written in pure JavaScript instead of TypeScript, which is different 
  from [vue-facing-decorator];
- It uses the most recent (currently version 2023-05)
  [stage 3 proposal of JavaScript decorators].
- It provides commonly used decorators for class-style Vue components, such as 
  `@Prop`, `@PropSync`, `@Model`, `@ModelSync`, `@Watch`, `@Provide`, `@Inject`, 
  `@Emit`, etc. (see [Predefined Decorators](#predefined-decorators) section for 
  more details). That is, it combines the functions of [vue-class-component]
  and [vue-property-decorator].

## Usage Examples

TODO

## Installation

```bash
yarn add vue3-class-component
```
or
```bash
npm install vue3-class-component
```

## Configuration

This library uses the most recent (currently version 2023-05)
[stage 3 proposal of JavaScript decorators], therefore you must configure the 
[Babel] with the [@babel/plugin-transform-class-properties] and the 
[@babel/plugin-proposal-decorators] plugins.

A possible [Babel] configuration file `babel.config.json` is as follows:
```json
{
  "presets": [
    "@babel/preset-env",
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
    "@babel/plugin-transform-class-properties"
  ],
}
``` 
Note that the plugin 

TODO

## Predefined Decorators

TODO

## Customize Decorators

TODO


[Vue]: https://vuejs.org/
[vue-class-component]: https://github.com/vuejs/vue-class-component
[vue-property-decorator]: https://github.com/kaorun343/vue-property-decorator
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[stage 3 proposal of JavaScript decorators]: https://github.com/tc39/proposal-decorators
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
