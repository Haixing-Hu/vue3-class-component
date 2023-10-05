# vue3-class-component

This library lets you make your [Vue] components in the class-style syntax. 
It's heavily inspired by [vue-class-component], except that:
- It supports [Vue] v3.x.x (currently v3.3.4);
- It's written in pure JavaScript instead of TypeScript, which is different 
  from [vue-facing-decorator];
- It uses the most recent (currently version 2023-05)
  [stage 3 proposal of JavaScript decorators] and [stage 3 proposal of JavaScript decorator metadata].
- It provides commonly used decorators for class-style Vue components, such as 
  `@Prop`, `@Watch`, `@Provide`, `@Inject`. (see [Predefined Decorators](#predefined-decorators) 
  section for more details). That is, it combines the functions of [vue-class-component]
  and [vue-property-decorator].

## Table of Contents

- [Usage Example](#usage-example)
- [Supported Options](#supported-options)
- [Installation](#installation)
- [Configuration](#configuration)
- [Predefined Decorators](#predefined-decorators)
  - [@Prop](#Prop)
  - [@Watch](#Watch)
  - [@Provide](#Provide)
  - [@Inject](#Inject)
- [Customize Decorators](#customize-decorators)

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
| State       | `data`            | NO        | The reactive states of the component should be defined as class fields.                                                                       |
| State       | `props`           | NO        | The properties of the component should be defined as class fields and marked with `@Prop` decorators.                                         |
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
| Composition | `provide`         | NO        | The `provide` properties should be defined as class fields and marked with `@Provide` decorators.                                             |
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
- [`@Watch`](#Watch)
- [`@Provid`](#Provide)
- [`@Inject`](#Inject)

### <span id="Prop">`@Prop` decorator</span>

The `@Prop` decorator is marked on class fields to declare props of the Vue
component. 

For example:
```js
@Component
class MyComponent {
  @Prop
  message = 'hello';
  
  @Prop({ type: Number, validator: (v) => (v >= 0) })
  value;

  // non-primitive default value DO NOT need to be wrapped by a factory function
  @Prop
  person = {
    id: 1,
    name: 'John',
    age: 32,
    gender: 'MALE',
  };
}

export default toVue(MyComponent);
```
is equivalent to:
```js
export default {
  name: 'MyComponent',
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
    person: {
      type: Object,
      required: false,
      default: () => ({
        id: 1,
        name: 'John',
        age: 32,
        gender: 'MALE',
      }),
    },
  },
};
```

The `@Prop` decorator may have an optional argument. The argument of the `@Prop` 
decorator is an object with the following options:

| Option      | Type       | Default     | Description                                               |
|-------------|------------|-------------|-----------------------------------------------------------|
| `type`      | `Function` | `undefined` | The type of the prop, which should be a type constructor. |
| `required`  | `Boolean`  | `false`     | Whether the prop is required.                             |
| `default`   | `any`      | `undefined` | The default value of the prop.                            |
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
 
  If this option is not specified, the library will automatically infer the
  value of this option from the initial value of the decorated class field.
- `default`: Specifies a default value for the prop when it is not passed by 
  the parent or has undefined value. Object or array defaults must be returned 
  using a factory function. The factory function also receives the raw props 
  object as the argument.
 
  If this option is not specified, the library will automatically infer the
  value of this option from the initial value of the decorated class field.

  Note that the [Vue] library requires the non-primitive default values of 
  props to be wrapped with factory functions, but this will be done by our
  library automatically. Therefore, there is no need to wrap the non-primitive
  default functions with factory functions when declaring props.
- `required`: Defines if the prop is required. In a non-production environment, 
  a console warning will be thrown if this value is truthy and the prop is not 
  passed.
 
  If this option is not specified, the library will automatically infer the
  value of this option from whether the initial value of the decorated class 
  field is provided.
- `validator`: Custom validator function that takes the prop value as the sole 
  argument. In development mode, a console warning will be thrown if this 
  function returns a falsy value (i.e. the validation fails).

### <span id="Watch">`@Watch` decorator</span>

The `@Watch` decorator is marked on class methods to declare watchers of the
Vue component. 

For example:
```js
@Component
class MyComponent {
  value = 123;
  
  person = {
    id: 1,
    name: 'John',
    age: 32,
    gender: 'MALE',
  };
  
  @Watch('value')
  onValueChanged(val, oldVal) {
    console.log(`The value is changed from ${oldVal} to ${val}.`);
  }
  
  @Watch('person', { deep: true })
  onPersonChanged(val, oldVal) {
    console.log(`The person is changed from ${oldVal} to ${val}.`);
  }
}

export default toVue(MyComponent);
```
is equivalent to:
```js
export default {
  name: 'MyComponent',
  data() {
    return {
      value: 123,
    };
  },
  watch: {
    value(val, oldVal) {
      console.log(`The value is changed from ${oldVal} to ${val}.`);
    },
    person: {
      deep: true,
      handler(val, oldVal) {
        console.log(`The person is changed from ${oldVal} to ${val}.`);
      },
    },
  },
};
```

The `@Watch` decorator has one or two arguments. The first argument of the 
`@Watch` decorator is the path of the watched states or watched properties. 
The second optional argument of the `@Watch` decorator is an object with the 
following options:

| Option      | Type      | Default | Description                                                                             |
|-------------|-----------|---------|-----------------------------------------------------------------------------------------|
| `deep`      | `Boolean` | `false` | Whether the watcher should deep traversal of the source if it is an object or an array. |
| `immediate` | `Boolean` | `false` | Whether the watcher should be called immediately after the watcher is created.          |
| `flush`     | `String`  | `'pre'` | The flushing timing of the watcher. It can be one of `'pre'`, `'post'` or `'sync'`.     |

- `deep`: force deep traversal of the source if it is an object or an array, so 
  that the callback fires on deep mutations. See [Deep Watchers].
- `immediate`: trigger the callback immediately on watcher creation. Old value 
  will be `undefined` on the first call. See [Eager Watchers].
- `flush`: adjust the callback's flush timing. It can be one of `'pre'`, `'post'` 
  or `'sync'`. See [Callback Flush Timing] and [watchEffect()].

**NOTE:** Unlike the `@Watch` decorator in [vue-property-decorator], the `@Watch`
decorator in this library does not support watching the same state or property
with more than one watching handlers. Since that is not a common use case, we
decide to simplify the implementation of the `@Watch` decorator.

### <span id="Provide">`@Provide` decorator</span>

The `@Provide` decorator is marked on class fields to declare provided values 
that can be injected by descendant components.

For example:
```js
const myInjectedKey = Symbol('myInjectedKey');

@Component
class AncestorComponent {
  @Provide
  message = 'hello';
  
  @Provide({key: myInjectedKey, reactive: true})
  @Prop
  value = 123;

  @Provide({ reactive: true })
  person = {
    id: 1,
    name: 'John',
    age: 32,
    gender: 'MALE',
  };
}

export default toVue(AncestorComponent);
```
is equivalent to:
```js
import { computed } from 'vue'

export default {
  name: 'AncestorComponent',
  props: {
    value: {
      type: Number,
      default: 123,
      required: false,
    },
  },
  data() {
    return {
      message: 'hello',
    };
  },
  provide() {
    return {
      message: this.message,                        // non-reactive
      [myInjectedKey]: computed(() => this.value),  // reactive
      person: computed(() => this.person),          // reactive
    };
  },
};
```

`@Provide` and `@Inject` decorators are used together to allow an ancestor 
component to serve as a dependency injector for all its descendants, regardless 
of how deep the component hierarchy is, as long as they are in the same parent 
chain. See [Provide / Inject] for more details.

The `@Provide` decorators may be used with an optional argument. The optional
argument is an object with the following options:

| Option     | Type               | Default     | Description                              |
|------------|--------------------|-------------|------------------------------------------|
| `key`      | `String \| Symbol` | `undefined` | The key of the provided value.           |
| `reactive` | `Boolean`          | `false`     | Whether the provided value is reactive.  |

- `key`: The key is used by child components to locate the correct value to 
  inject. The key could be either a string or a symbol. See [working with symbol keys] 
  for more details. If this option is not specified, the name of the field 
  decorated by the `@Provide` decorator will be used as the key. 
- `reactive`: Indicates whether the provided value is reactive. By default, the
  provided values are not reactive, i.e., changing the provided value in the 
  ancestor component will not affect the injected value in the descendant 
  components. If this option is set to `true`, the provided value will be
  made reactive. See [working with reactivity] for more details.

**NOTE:** The [vue-property-decorator] provides `@Provide` and `@ProvideReactive`
decorators to declare non-reactive and reactive provided values respectively. 
But this library simplifies the implementation by providing only one `@Provide`
decorator with an optional `reactive` option. Since the provided values are
usually non-reactive, we decide to make the default value of the `reactive`
option to be `false`.

### <span id="Inject">`@Inject` decorator</span>

The `@Inject` decorator is marked on class fields to declare injected values.

For example:
```js
@Component
class DescendantComponent {
  @Inject
  message;
  
  @Inject({from: myInjectedKey, default: 0})
  injectedValue;

  // non-primitive default value DO NOT need to be wrapped by a factory function
  @Inject({ default: {id: 0, name: 'unknown'} }) 
  person;
}

export default toVue(DescendantComponent);
```
is equivalent to:
```js
export default {
  name: 'DescendantComponent',
  inject: {
    message: {              // non-reactive
      from: 'message',
      default: undefined,
    },
    injectedValue: {        // reactive, since the provided `myInjectedKey` is reactive
      from: myInjectedKey,
      default: 0,
    },
    person: {               // reactive, since the provided `person` is reactive
      from: 'person',
      default: () => ({id: 0, name: 'unknown'}),
    },
  },
};
```

`@Provide` and `@Inject` decorators are used together to allow an ancestor
component to serve as a dependency injector for all its descendants, regardless
of how deep the component hierarchy is, as long as they are in the same parent
chain. See [Provide / Inject] for more details.

The `@Inject` decorators may have an optional argument. The optional argument
is an object with the following options:

| Option    | Type               | Default     | Description                                          |
|-----------|--------------------|-------------|------------------------------------------------------|
| `from`    | `String \| Symbol` | `undefined` | The key of the source provided value to be injected. |
| `default` | `any`              | `undefined` | The default value of the injected value.             |

- `from`: The value of this option specifies the key of the provided value to be 
  injected. The key could be either a string or a symbol. See [working with symbol keys]
  for more details. If this option is not specified, the name of the field
  decorated by the `@Injected` decorator will be used as the key.
- `default`: The default value of the injected property. Note that similar to 
  the `default` option of the `@Prop` decorator, this library will automatically
  transform the non-primitive default values to factory functions.

**NOTE:** If the provided value is non-reactive, the corresponding injected value
is also non-reactive. If the provided value is reactive, the corresponding injected
is also reactive. See [working with reactivity] for mor details.

**NOTE:** The [vue-property-decorator] provides `@Inject` and `@InjectReactive`
decorators to declare non-reactive and reactive injected values respectively.
But this library simplifies the implementation by providing only one `@Inject`
decorator, and the reactivity of the injected value is determined by the reactivity
of the provided value.

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
[Deep Watchers]: https://vuejs.org/guide/essentials/watchers#deep-watchers
[Eager Watchers]: https://vuejs.org/guide/essentials/watchers.html#eager-watchers
[Callback Flush Timing]: https://vuejs.org/guide/essentials/watchers#callback-flush-timing
[watchEffect()]: https://vuejs.org/api/reactivity-core#watcheffect
[Provide / Inject]: https://vuejs.org/guide/components/provide-inject.html
[working with symbol keys]: https://vuejs.org/guide/components/provide-inject.html#working-with-symbol-keys
[working with reactivity]: https://vuejs.org/guide/components/provide-inject#working-with-reactivity
