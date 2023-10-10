# vue3-class-component

[![npm package](https://img.shields.io/npm/v/@haixing_hu/vue3-class-component.svg)](https://npmjs.com/package/@haixing_hu/vue3-class-component)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/vue3-class-component/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/vue3-class-component/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/vue3-class-component/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/vue3-class-component?branch=master)

This library allows you to create your [Vue] components using the class-style syntax.
It draws heavy inspiration from [vue-class-component], with a few notable differences:

- It supports [Vue] v3.x.x (currently v3.3.4).
- Unlike [vue-facing-decorator], it's written in pure JavaScript rather than TypeScript,
  eliminating the need for TypeScript configuration.
- It adopts the most recent (as of May 2023) [stage 3 proposal of JavaScript decorators]
  and [stage 3 proposal of JavaScript decorator metadata].
- It offers a set of commonly used decorators for class-style Vue components, such as
  `@Prop`, `@Watch`, `@Provide`, and `@Inject` (for more details, refer to the
  [Predefined Decorators](#predefined-decorators) section). In essence, it
  combines the functionality of [vue-class-component] and [vue-property-decorator].
- Offer both UMD and ESM bundling formats, providing support for both [webpack] and [vite].
  For more details, refer to the [Configuration](#configuration) section.
- It has undergone extensive unit testing, achieving a remarkable 100% code coverage.
- The code has undergone a complete rewrite, and the functionality of decorators has been redesigned for improved coherence and efficiency.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Example](#usage-example)
- [Supported Options](#supported-options)
- [Predefined Decorators](#predefined-decorators)
  - [@Prop](#Prop)
  - [@Watch](#Watch)
  - [@Provide](#Provide)
  - [@Inject](#Inject)
- [Customize Decorators](#customize-decorators)

## <span id="installation">Installation</span>

```bash
yarn add @haixing_hu/vue3-class-component
```
or
```bash
npm install @haixing_hu/vue3-class-component
```

## <span id="configuration">Configuration</span>

This library uses the most recent (currently May 2023)
[stage 3 proposal of JavaScript decorators]. Therefore, you must configure
[Babel] with [@babel/plugin-transform-class-properties] and the
[@babel/plugin-proposal-decorators] plugins.

**NOTE:** To support the [stage 3 proposal of JavaScript decorator metadata],
the version of the [Babel] plugin [@babel/plugin-proposal-decorators] must be
at least `7.23.0`.

### <span id="webpack">Bundling with [webpack]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @haixing_hu/vue3-class-component
    yarn add --dev @babel/core @babel/runtime @babel/preset-env
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  Configure [Babel] by using the [@babel/plugin-transform-class-properties]
    and [@babel/plugin-proposal-decorators] plugins. A possible [Babel]
    configuration file `babelrc.json` is as follows:
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

For detailed configuration instructions, you can refer to:
- A sample project created with [vue-cli] and [webpack]: [vue3-class-component-demo-webpack]

### <span id="vite">Bundling with [vite]</span>

1.  Install the required dependencies:
    ```shell
    yarn add @haixing_hu/vue3-class-component
    yarn add --dev @babel/core @babel/runtime @babel/preset-env
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  Configure [Babel] by using [@babel/plugin-transform-class-properties] and
    [@babel/plugin-proposal-decorators] plugins. A possible [Babel] configuration
    file `babelrc.json` is as follows:
    ```json
    {
      "presets": [
        ["@babel/preset-env", { "modules": false }]
      ],
      "plugins": [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "version": "2023-05" }],
        "@babel/plugin-transform-class-properties"
      ]
    }
    ```
    **Note:** When bundling with [vite], make sure to set the `modules` parameter
    of `@babel/preset-env` to `false`.
3.  Configure [vite] by modifying the `vite.config.js` file to add support for
    [Babel]. A possible `vite.config.js` file is as follows:
    ```js
    import { fileURLToPath, URL } from 'node:url';
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import * as babel from '@babel/core';

    // A very simple Vite plugin support babel transpilation
    const babelPlugin = {
      name: 'plugin-babel',
      transform: (src, id) => {
        if (/\.(jsx?|vue)$/.test(id)) {              // the pattern of the file to handle
          return babel.transform(src, {
            filename: id,
            babelrc: true,
          });
        }
      },
    };
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        vue({
          script: {
            babelParserPlugins: ['decorators'],     // must enable decorators support
          },
        }),
        babelPlugin,                                // must be after the vue plugin
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    });
    ```
    **Note:** In the above configuration file, we've implemented a simple [Vite]
    plugin to transpile the code processed by the [vite-plugin-vue] plugin using
    [Babel]. Although there's a [vite-plugin-babel] plugin that claims to add
    [Babel] support to [vite], we found it doesn't correctly handle [vue] Single
    File Components (SFCs). After closely examining its source code, we
    determined that to achieve correct transpilation, we need to apply [Babel]
     after [vite-plugin-vue] processes the source code. Therefore, the very
    simple plugin function above suffices for our needs.

For detailed configuration instructions, you can refer to:
- A sample project created with [create-vue] and [vite]: [vue3-class-component-demo-vite]

## <span id="usage-example">Usage Example</span>

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

## <span id="supported-options">Supported Options</span>

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

| Category    | Option            | Supported | Description                                                                                                                    |
|-------------|-------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------|
| State       | `data`            | NO        | Reactive states of the component should be defined as class fields.                                                            |
| State       | `props`           | NO        | Component properties should be defined as class fields and marked with `@Prop` decorators.                                     |
| State       | `computed`        | NO        | Computed properties should be defined as class getters.                                                                        |
| State       | `methods`         | NO        | Component methods should be defined as class methods.                                                                          |
| State       | `watch`           | NO        | Watchers should be defined as class methods marked with `@Watch` decorators.                                                   |
| State       | `emits`           | YES       | Custom events emitted by the Vue component can be declared in the `@Component` options.                                        |
| State       | `expose`          | YES       | Exposed public properties can be declared in the `@Component` options.                                                         |
| Rendering   | `template`        | YES       | The string template can be declared in the `@Component` options.                                                               |
| Rendering   | `render`          | NO        | The render function should be defined as a class method.                                                                       |
| Rendering   | `compilerOptions` | YES       | Compiler options for string templates can be declared in the `@Component` options.                                             |
| Rendering   | `slot`            | YES       | Vue component slots can be declared in the `@Component` options.                                                               |
| Lifecycle   | `beforeCreate`    | NO        | The `beforeCreate` hook should be defined as a class method.                                                                   |
| Lifecycle   | `created`         | NO        | The `created` hook should be defined as a class method.                                                                        |
| Lifecycle   | `beforeMount`     | NO        | The `beforeMount` hook should be defined as a class method.                                                                    |
| Lifecycle   | `mounted`         | NO        | The `mounted` hook should be defined as a class method.                                                                        |
| Lifecycle   | `beforeUpdate`    | NO        | The `beforeUpdate` hook should be defined as a class method.                                                                   |
| Lifecycle   | `updated`         | NO        | The `updated` hook should be defined as a class method.                                                                        |
| Lifecycle   | `beforeUnmount`   | NO        | The `beforeUnmount` hook should be defined as a class method.                                                                  |
| Lifecycle   | `unmounted`       | NO        | The `unmounted` hook should be defined as a class method.                                                                      |
| Lifecycle   | `errorCaptured`   | NO        | The `errorCaptured` hook should be defined as a class method.                                                                  |
| Lifecycle   | `renderTracked`   | NO        | The `renderTracked` hook should be defined as a class method.                                                                  |
| Lifecycle   | `renderTriggered` | NO        | The `renderTriggered` hook should be defined as a class method.                                                                |
| Lifecycle   | `activated`       | NO        | The `activated` hook should be defined as a class method.                                                                      |
| Lifecycle   | `deactivated`     | NO        | The `deactivated` hook should be defined as a class method.                                                                    |
| Lifecycle   | `serverPrefetch`  | NO        | The `serverPrefetch` hook should be defined as a class method.                                                                 |
| Composition | `provide`         | NO        | `provide` properties should be defined as class fields and marked with `@Provide` decorators.                                  |
| Composition | `inject`          | NO        | `inject` properties should be defined as class fields and marked with `@Inject` decorators.                                    |
| Composition | `mixins`          | YES       | Mixed-in objects array can be declared in the `@Component` options.                                                            |
| Composition | `extends`         | YES       | Base Vue component to extend from can be declared in the `@Component` options.                                                 |
| Misc        | `name`            | YES       | Vue component name can be declared in the `@Component` options; otherwise, the class name of the decorated class will be used. |
| Misc        | `inheritAttrs`    | YES       | `inheritAttrs` can be declared in the `@Component` options.                                                                    |
| Misc        | `components`      | YES       | Registered components of the Vue component can be declared in the `@Component` options.                                        |
| Misc        | `directives`      | YES       | Registered directives of the Vue component can be declared in the `@Component` options.                                        |

## <span id="predefined-decorators">Predefined Decorators</span>

This library provides the following commonly used decorators for class-style
Vue components:

- [`@Prop`](#Prop)
- [`@Watch`](#Watch)
- [`@Provid`](#Provide)
- [`@Inject`](#Inject)

### <span id="Prop">`@Prop` decorator</span>

The `@Prop` decorator is applied to class fields to declare the props of the Vue
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

| Option      | Type       | Default     | Description                                                        |
|-------------|------------|-------------|--------------------------------------------------------------------|
| `type`      | `Function` | `undefined` | The data type of the prop, which should be a constructor function. |
| `required`  | `Boolean`  | `false`     | Indicates whether the prop is required or not.                     |
| `default`   | `any`      | `undefined` | Specifies the default value of the prop.                           |
| `validator` | `Function` | `undefined` | A custom validation function for the prop.                         |

- `type`: This option defines the expected data type of the prop, and it can be
  one of the following: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`,
  `Function`, `Symbol`, a custom class, a custom constructor function, or an
  array of these types. In development mode, Vue will validate if the prop's
  value matches the declared type and will issue a warning if it doesn't. For
  more details, see [Prop Validation].

  Note that a prop with a `Boolean` type affects its value casting behavior both
  in development and production modes. See [Boolean Casting] for more details.

  If this option is not specified, the library will infer the type from the
  initial value of the decorated class field.

- `default`:  Use this option to provide a default value for the prop when it is
  not passed by the parent component or has an undefined value.

  If this option is not specified, the library will automatically infer the
  default value from the initial value of the decorated class field.

  It's worth noting that the [Vue] library requires non-primitive default values
  of props to be wrapped with factory functions, but our library handles this
  automatically. Therefore, you don't need to wrap non-primitive default values
  with factory functions when declaring props.
- `required`: Use this option to specify whether the prop is required or not. In
  a non-production environment, a console warning will be generated if this
  value is truthy and the prop is not provided.

  If this option is not specified, the library will automatically infer whether
  the initial value of the decorated class field is provided to determine if the
  prop is required.
- `validator`: This option allows you to define a custom validation function
  that takes the prop value as its sole argument. In development mode, a console
  warning will be generated if this function returns a falsy value, indicating
  that the validation has failed.

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

The `@Watch` decorator can take one or two arguments. The first argument of the
`@Watch` decorator specifies the path of the watched states or watched properties.
The second optional argument of the `@Watch` decorator is an object with the
following options:

| Option      | Type      | Default | Description                                                                                                             |
|-------------|-----------|---------|-------------------------------------------------------------------------------------------------------------------------|
| `deep`      | `Boolean` | `false` | Indicates whether the watcher should perform a deep traversal of the source, especially if it is an object or an array. |
| `immediate` | `Boolean` | `false` | Specifies whether the watcher should be triggered immediately after its creation.                                       |
| `flush`     | `String`  | `'pre'` | Defines the flushing timing of the watcher. It can be one of `'pre'`, `'post'`, or `'sync'`.                            |

- `deep`: Forces a deep traversal of the source, particularly if it is an object
  or an array, allowing the callback to be triggered on deep mutations. Refer to
  [Deep Watchers] for more information.
- `immediate`: Triggers the callback immediately upon the creation of the watcher.
  The old value will be `undefined` on the first call. Refer to [Eager Watchers]
  for more details.
- `flush`: Adjusts the timing at which the callback is executed. It can be one
  of `'pre'`, `'post'`, or `'sync'`. See [Callback Flush Timing] and
  [watchEffect()] for further details.

**NOTE:** Unlike the `@Watch` decorator in [vue-property-decorator], the `@Watch`
decorator in this library does not support watching the same state or property
with more than one watching handler. As this is not a common use case, we have
chosen to simplify the implementation of the `@Watch` decorator.

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
The `@Provide` and `@Inject` decorators are used together to enable an ancestor
component to serve as a dependency injector for all of its descendants,
regardless of how deep the component hierarchy goes, as long as they are in the
same parent chain. For more details, please refer to [Provide / Inject].

The `@Provide` decorators may be used with an optional argument. This optional
argument is an object with the following options:

| Option     | Type               | Default     | Description                                       |
|------------|--------------------|-------------|---------------------------------------------------|
| `key`      | `String \| Symbol` | `undefined` | The key of the provided value.                    |
| `reactive` | `Boolean`          | `false`     | Indicates whether the provided value is reactive. |

- `key`: The key is used by child components to locate the correct value to
  inject. The key could be either a string or a symbol. Refer to
  [working with symbol keys] for more details. If this option is not specified,
  the name of the field decorated by the `@Provide` decorator will be used as
  the key.
- `reactive`: Specifies whether the provided value is reactive. By default,
  the provided values are not reactive, meaning that changing the provided
  value in the ancestor component will not affect the injected value in the
  descendant components. If this option is set to `true`, the provided value
  will be made reactive. Refer to [working with reactivity] for more details.

**NOTE:** [vue-property-decorator] provides `@Provide` and `@ProvideReactive`
decorators to declare non-reactive and reactive provided values, respectively.
However, this library simplifies the implementation by offering only one
`@Provide` decorator with an optional `reactive` option. Since provided values
are typically non-reactive, we have decided to set the default value of the
`reactive` option to `false`.

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

The `@Provide` and `@Inject` decorators are used together to enable an ancestor
component to act as a dependency injector for all its descendants, regardless
of how deep the component hierarchy goes, as long as they are in the same parent
chain. For more details, please refer to [Provide / Inject].

The `@Inject` decorators can have an optional argument, which is an object with
the following options:

| Option    | Type               | Default     | Description                                          |
|-----------|--------------------|-------------|------------------------------------------------------|
| `from`    | `String \| Symbol` | `undefined` | The key of the source provided value to be injected. |
| `default` | `any`              | `undefined` | The default value of the injected value.             |

- `from`: The value of this option specifies the key of the provided value to be
  injected. The key could be either a string or a symbol. Refer to
  [working with symbol keys] for more details. If this option is not specified,
  the name of the field decorated by the `@Injected` decorator will be used as
  the key.
- `default`: The default value of the injected property. Note that similar to
  the `default` option of the `@Prop` decorator, this library will automatically
  transform the non-primitive default values into factory functions.

**NOTE:** If the provided value is non-reactive, the corresponding injected value
is also non-reactive. If the provided value is reactive, the corresponding injected
is also reactive. Refer to [working with reactivity] for more details.

**NOTE:** [vue-property-decorator] provides `@Inject` and `@InjectReactive`
decorators to declare non-reactive and reactive injected values, respectively.
However, this library simplifies the implementation by providing only one `@Inject`
decorator, and the reactivity of the injected value is determined by the reactivity
of the provided value.

## <span id="customize-decorators">Customize Decorators</span>

This library provides a `createDecorator()` function for creating custom
decorators. The function takes a callback function as an argument and returns a
decorator function. The callback function will be invoked with the following
parameters:

- `Class`: The constructor of the decorated class.
- `defaultInstance`: The default constructed instance of the decorated class.
  This default instance can be used to access all the class instance fields of
  the decorated class.
- `target`: The target value being decorated, which could be a class method, a
  getter, or a setter. Note that if the decorated target is a class field,
  this argument will always be `undefined`.
- `context`: The context object containing information about the target being
  decorated, as described in [stage 3 proposal of JavaScript decorators] and
  [stage 3 proposal of JavaScript decorator metadata].
- `options`: The Vue component options object. Changes to this object will
  affect the provided component.

The callback function is called by the library to allow it to modify the Vue
component options. The return value of the callback function will be ignored.

The `createDecorator()` function returns a decorator function that takes the
following two arguments:

- `target`: The target value being decorated, which could be a class method,
  class field, getter, or setter. If the decorated target is a class field,
  this argument will always be `undefined`.
- `context`: The context object containing information about the target being
  decorated, as described in [stage 3 proposal of JavaScript decorators]
  and [stage 3 proposal of JavaScript decorator metadata].

Here is an example of how to use it:
```js
const Log = createDecorator((Class, defaultInstance, target, context, options) => {
  if (context?.kind !== 'method') {
    throw new Error('The @Log decorator can only be used to decorate a class method.');
  }
  const methodName = context.name;
  const originalMethod = options.methods[methodName];
  options.methods[methodName] = function (...args) {
    console.log(`${Class.name}.${methodName}: ${args.join(', ')}`);
    return originalMethod.apply(this, args);
  };
});
```

The above example demonstrates how to create a `@Log` decorator, which can be
employed to log the arguments of a class method. For instance:
```js
@Component
class HelloPage {
  message = 'hello';

  value = 0;

  newMessage = '';

  @Log
  mounted() {
    this.value = this.$route.params.value;
  }

  get computedMessage() {
    return this.message + '!';
  }

  @Log
  setMessage(s) {
    this.message = s;
  }
}

export default toVue(MyComponent);
```

**NOTE:** The `@Log` decorator mentioned above cannot be applied to the getter
or setter of the component class.

[Vue]: https://vuejs.org/
[vue-cli]: https://cli.vuejs.org/
[webpack]: https://webpack.js.org/
[create-vue]: https://github.com/vuejs/create-vue
[vite]: https://vitejs.dev/
[vue-class-component]: https://github.com/vuejs/vue-class-component
[vue-property-decorator]: https://github.com/kaorun343/vue-property-decorator
[vue-facing-decorator]: https://github.com/facing-dev/vue-facing-decorator
[Babel]: https://babeljs.io/
[@babel/plugin-transform-class-properties]: https://babeljs.io/docs/babel-plugin-transform-class-properties
[@babel/plugin-proposal-decorators]: https://babeljs.io/docs/babel-plugin-proposal-decorators
[stage 3 proposal of JavaScript decorators]: https://github.com/tc39/proposal-decorators
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
[vue3-class-component]: https://github.com/Haixing-Hu/vue3-class-component
[vue3-class-component-demo-webpack]: https://github.com/Haixing-Hu/vue3-class-component-demo-webpack
[vue3-class-component-demo-vite]: https://github.com/Haixing-Hu/vue3-class-component-demo-vite
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
