# vue3-class-component

This library lets you make your [Vue] components in the class-style syntax. 
It's heavily inspired by [vue-class-component], except that:
- It supports [Vue] v3.x.x (currently v3.3.4);
- It's written in pure JavaScript instead of TypeScript, which is different 
  from [vue-facing-decorator];
- It uses the most recent (currently version 2023-05)
  [stage 3 proposal of JavaScript decorators] and [stage 3 proposal of JavaScript decorator metadata].
- It provides commonly used decorators for class-style Vue components, such as 
  `@Prop`, `@PropSync`, `@Model`, `@ModelSync`, `@Watch`, `@Provide`, `@Inject`, 
  `@Emit`, etc. (see [Predefined Decorators](#predefined-decorators) section for 
  more details). That is, it combines the functions of [vue-class-component]
  and [vue-property-decorator].

## Usage Example

```vue
<template>
  <div class="hello-page">
    <div class="message">{{ message }}</div>
    <div class="computed-message">{{ computedMessage }}</div>
    <div class="value">{{ value }}</div>
    <input v-model="newMessage">
    <button @click="setMessage(newMessage)">Set Message</button>
  </div>
</template>
<script>
import { Component, toVue } from 'vue3-class-component';

@Component
class HelloPage {
  message = 'hello';
  
  value = 0;
  
  newMessage = '';
  
  mounted() {
    this.value = this.$route.params.value;
  }
  
  get computedMessage() {
    return this.message + '!';
  }
  
  setMessage(s) {
    this.message = s;
  }
}

export default toVue(MyComponent); // don't forget calling `toVue`
</script>
```

The above code is equivalent to the following code:
```vue
<template>
  <div class="hello-page">
    <div class="message">{{ message }}</div>
    <div class="computed-message">{{ computedMessage }}</div>
    <div class="value">{{ value }}</div>
    <input v-model="newMessage">
    <button @click="setMessage(newMessage)">Set Message</button>
  </div>
</template>
<script>
export default {
  name: 'HelloPage',
  data() {
    return {
      message: 'hello',
      value: 0,
      newMessage: '',
    };
  },
  mounted() {
    this.value = this.$route.params.value;
  },
  computed: {
    computedMessage() {
      return this.message + '!';
    },
  },
  methods: {
    setMessage(s) {
      this.message = s;
    },
  },
};
</script>
```

## Supported Options

The `@Component` decorator can be used with an options argument, which will be 
passed to the generated options of the Vue component. For example:
```js
@Component({
  name: 'Hello',  // override the name of the class
  components: {
    PhoneLink,
  },
  filters: {
    capitalize: (s) => s.toUpperCase(),
  },
})
class HelloPage {
  message = 'hello';
  
  value = 0;
  
  newMessage = '';
  
  mounted() {
    this.value = this.$route.params.value;
  }
  
  get computedMessage() {
    return this.message + '!';
  }
  
  setMessage(s) {
    this.message = s;
  }
}

export default toVue(MyComponent); // don't forget calling `toVue`
```
is equivalent to:
```js
export default {
  name: 'Hello',
  components: {
    PhoneLink,
  },
  filters: {
    capitalize: (s) => s.toUpperCase(),
  },
  data() {
    return {
      message: 'hello',
      value: 0,
      newMessage: '',
    };
  },
  mounted() {
    this.value = this.$route.params.value;
  },
  computed: {
    computedMessage() {
      return this.message + '!';
    },
  },
  methods: {
    setMessage(s) {
      this.message = s;
    },
  },
};
```

The following table lists all the keywords in the Vue options API and whether it
is supported in the argument of the `@Component` decorator:

| Category    | Option            | Supported | Description                                                                                                                                   |
|-------------|-------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| State       | `data`            | NO        | The reactive data objects should be defined as class fields.                                                                                  |
| State       | `props`           | NO        | The properties should be defined as class fields and marked with `@Prop` decorators.                                                          |
| State       | `computed`        | NO        | The computed properties should be defined as class getters.                                                                                   |
| State       | `methods`         | NO        | The methods of a component should be defined as class methods.                                                                                |
| State       | `watch`           | NO        | The watchers should be defined as class methods marked with `@Watch` decorators.                                                              |
| State       | `emits`           | YES       | The custom events emitted by the Vue component could be declared in the options of `@Component`.                                              |
| State       | `expose`          | YES       | The exposed public properties could be declared in the options of `@Component`.                                                               |
| Rendering   | `template`        | YES       | The string template could be declared in the options of `@Component`.                                                                         |
| Rendering   | `render`          | NO        | The render function should be defined as a class method.                                                                                      |
| Rendering   | `compilerOptions` | YES       | The compiler options of the string template could be declared in the options of `@Component`.                                                 |
| Rendering   | `slot`            | YES       | The slots of the Vue component could be declared in the options of `@Component`.                                                              |
| Lifecycle   | `beforeCreate`    | NO        | The `beforeCreate` hook should be defined as a class method.                                                                                  |
| Lifecycle   | `created`         | NO        | The `created` hook should be defined as a class method.                                                                                       |
| Lifecycle   | `beforeMount`     | NO        | The `beforeMount` hook should be defined as a class method.                                                                                   |
| Lifecycle   | `mounted`         | NO        | The `mounted` hook should be defined as a class method.                                                                                       |
| Lifecycle   | `beforeUpdate`    | NO        | The `beforeUpdate` hook should be defined as a class method.                                                                                  |
| Lifecycle   | `updated`         | NO        | The `updated` hook should be defined as a class method.                                                                                       |
| Lifecycle   | `beforeUnmount`   | NO        | The `beforeUnmount` hook should be defined as a class method.                                                                                 |
| Lifecycle   | `unmounted`       | NO        | The `unmounted` hook should be defined as a class method.                                                                                     |
| Lifecycle   | `errorCaptured`   | NO        | The `errorCaptured` hook should be defined as a class method.                                                                                 |
| Lifecycle   | `renderTracked`   | NO        | The `renderTracked` hook should be defined as a class method.                                                                                 |
| Lifecycle   | `renderTriggered` | NO        | The `renderTriggered` hook should be defined as a class method.                                                                               |
| Lifecycle   | `activated`       | NO        | The `activated` hook should be defined as a class method.                                                                                     |
| Lifecycle   | `deactivated`     | NO        | The `deactivated` hook should be defined as a class method.                                                                                   |
| Lifecycle   | `serverPrefetch`  | NO        | The `serverPrefetch` hook should be defined as a class method.                                                                                |
| Composition | `provide`         | NO        | The `provide` function should be defined as a class method which returns provided properties.                                                 |
| Composition | `inject`          | NO        | The `inject` properties should be defined as class fields and marked with `@Inject` decorators.                                               |
| Composition | `mixins`          | YES       | The mixed in objects array could be declared in the options of `@Component`.                                                                  |
| Composition | `extends`         | YES       | The base Vue component to extend from could be declared in the options of `@Component`.                                                       |
| Misc        | `name`            | YES       | The name of the Vue component could be declared in the options of `@Component`; otherwise the class name of the decorated class will be used. |
| Misc        | `inheritAttrs`    | YES       | The `inheritAttrs` could be declared in the options of `@Component`.                                                                          |
| Misc        | `components`      | YES       | The registered components of the Vue component could be declared in the options of `@Component`.                                              |
| Misc        | `directives`      | YES       | The registered directives of the Vue component could be declared in the options of `@Component`.                                              |

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
    "@babel/preset-env"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
    "@babel/plugin-transform-class-properties"
  ]
}
``` 

**NOTE:** In order to support the [stage 3 proposal of JavaScript decorator metadata],
the version of the babel plugin `@babel/plugin-proposal-decorators` must be 
greater than `7.23.0`.

## Predefined Decorators

This library provides the following commonly used decorators for class-style 
Vue components:

- [`@Prop`](#Prop)
- [`@Model`](#Model)
- [`@Watch`](#Watch)
- [`@Provid`](#Provide)
- [`@Inject`](#Inject)
- [`@Emit`](#Emit)

### <span id="Prop">`@Prop` decorator</span>

The `@Prop` decorator is marked on a class field to declare a prop of the Vue
component. For example:
```js
@Component
class MyPage {
  @Prop
  message = 'hello';
  
  @Prop({ type: Number, validator: (v) => (v >= 0) })
  value;
}
export default toVue(MyPage);
```
is equivalent to:
```js
export default {
  name: 'MyPage',
  props: {
    message: {
      type: String,
      default: 'hello',
    },
    value: {
      type: Number,
      required: true,
      validator: (v) => {
        return v >= 0
      },
    },
  },
};
```

The argument of the `@Prop` decorator is an object with the following options:

| Option      | Type       | Default     | Description                                               |
|-------------|------------|-------------|-----------------------------------------------------------|
| `type`      | `Function` | `undefined` | The type of the prop, which should be a type constructor. |
| `required`  | `Boolean`  | `false`     | Whether the prop is required.                             |
| `default`   | `any`      | `null`      | The default value of the prop.                            |
| `validator` | `Function` | `undefined` | The validator function of the prop.                       |

- `type`: The type of the prop, which can be one of the following native 
  constructors: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, 
  `Function`, `Symbol`, any custom constructor function or an array of those. 
  In development mode, Vue will check if a prop's value matches the declared 
  type, and will throw a warning if it doesn't. See [Prop Validation] for more 
  details.
  Also note that a prop with `Boolean` type affects its value casting behavior in 
  both development and production. See [Boolean Casting] for more details.
  If this option is not specified, the library will infer the value of this
  option from the initial value of the decorated class field.
- `default`: Specifies a default value for the prop when it is not passed by 
  the parent or has undefined value. Object or array defaults must be returned 
  using a factory function. The factory function also receives the raw props 
  object as the argument.
  If this option is not specified, the library will infer the value of this
  option from the initial value of the decorated class field.
- `required`: Defines if the prop is required. In a non-production environment, 
  a console warning will be thrown if this value is truthy and the prop is not 
  passed.
- `validator`: Custom validator function that takes the prop value as the sole 
  argument. In development mode, a console warning will be thrown if this 
  function returns a falsy value (i.e. the validation fails).

### <span id="Model">`@Model` decorator</span>

### <span id="Watch">`@Watch` decorator</span>

### <span id="Provide">`@Provide` decorator</span>

### <span id="Inject">`@Inject` decorator</span>

### <span id="Emit">`@Emit` decorator</span>


## Customize Decorators

TODO


[Vue]: https://vuejs.org/
[vue-class-component]: https://github.com/vuejs/vue-class-component
[vue-property-decorator]: https://github.com/kaorun343/vue-property-decorator
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
[stage 3 proposal of JavaScript decorators]: https://github.com/tc39/proposal-decorators
[stage 2 proposal of JavaScript decorators]: https://www.proposals.es/proposals/Decorators
[legacy proposal of JavaScript decorators]: https://github.com/wycats/javascript-decorators
[stage 3 proposal of JavaScript decorator metadata]: https://github.com/tc39/proposal-decorator-metadata
[Prop Validation]: https://vuejs.org/guide/components/props.html#prop-validation
[Boolean Casting]: https://vuejs.org/guide/components/props.html#boolean-casting
