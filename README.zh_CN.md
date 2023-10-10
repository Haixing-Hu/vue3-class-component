# vue3-class-component

[![npm package](https://img.shields.io/npm/v/@haixing_hu/vue3-class-component.svg)](https://npmjs.com/package/@haixing_hu/vue3-class-component)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/vue3-class-component/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/vue3-class-component/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/vue3-class-component/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/vue3-class-component?branch=master)

这个库允许您使用类式语法创建您的 [Vue] 组件。它从 [vue-class-component] 得到了很多灵感，但有一些显著的区别：

- 它支持 [Vue] v3.x.x（当前版本为 v3.3.4）。
- 与 [vue-facing-decorator] 不同，它使用纯 JavaScript 而非 TypeScript 编写，不再需要配置使用 TypeScript。
- 它采用了最新的（截止到2023年5月） [JavaScript 装饰器第3阶段提案] 和
  [JavaScript 装饰器元数据第3阶段提案]。
- 它提供了用于类式 Vue 组件的常用装饰器，如 @Prop、@Watch、@Provide 和 @Inject（更多详情
  请参阅[预定义装饰器](#predefined-decorators)部分）。简而言之，它结合了 [vue-class-component] 和
  [vue-property-decorator] 的功能。
- 同时提供 UMD 和 ESM 打包格式，支持[webpack]和[vite]。更多详细信息，请参阅[配置](#configuration)部分。
- 经过详细单元测试，代码覆盖率达到了100%。
- 代码全面重写，装饰器功能经过重新设计，更加合理。

## 目录

- [安装方式](#installation)
- [配置方式](#configuration)
- [使用示例](#usage-example)
- [支持的选项](#supported-options)
- [预定义装饰器](#predefined-decorators)
    - [@Prop 装饰器](#Prop)
    - [@Watch 装饰器](#Watch)
    - [@Provide 装饰器](#Provide)
    - [@Inject 装饰器](#Inject)
- [自定义装饰器](#customize-decorators)

## <span id="installation">安装方式</span>

```bash
yarn add @haixing_hu/vue3-class-component
```
or
```bash
npm install @haixing_hu/vue3-class-component
```

## <span id="configuration">配置方式</span>

这个库使用了最新的（截止到2023年5月）[JavaScript 装饰器第3阶段提案] 和
[JavaScript 装饰器元数据第3阶段提案]，因此您必须配置 [Babel]，
使用 [@babel/plugin-transform-class-properties] 和
[@babel/plugin-proposal-decorators] 插件。

**注意：** 为了支持 [JavaScript 装饰器元数据第3阶段提案],
插件 [@babel/plugin-proposal-decorators] 的版本号必须至少为 `7.23.0`。

### <span id="webpack">使用 [webpack] 打包</span>

1.  安装需要的依赖：
    ```bash 
    yarn add @haixing_hu/vue3-class-component
    yarn add --dev @babel/core @babel/runtime @babel/preset-env 
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  配置 [Babel]，使用 [@babel/plugin-transform-class-properties] 和
    [@babel/plugin-proposal-decorators] 插件。一个可能的 [Babel] 配置文件 `babelrc.json` 如下：
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

详细配置过程可以参考：
- 使用 [vue-cli] 和 [webpack] 创建的演示项目：[vue3-class-component-demo-webpack]

### <span id="vite">使用 [vite] 打包</span>

1.  安装需要的依赖：
    ```bash 
    yarn add @haixing_hu/vue3-class-component
    yarn add --dev @babel/core @babel/runtime @babel/preset-env 
    yarn add --dev @babel/plugin-proposal-decorators @babel/plugin-transform-class-properties @babel/plugin-transform-runtime
    ```
2.  配置 [Babel]，使用 [@babel/plugin-transform-class-properties] 和
    [@babel/plugin-proposal-decorators] 插件。一个可能的 [Babel] 配置文件 `babelrc.json` 如下：
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
    **注意：** 使用 [vite] 打包需要将 `@babel/preset-env` 的参数 `modules` 设置为 `false`。
3.  配置 [vite]，修改 `vite.config.js` 文件，使其支持 [Babel]。一个可能的 `vite.config.js` 文件如下：
    ```javascript
    import { fileURLToPath, URL } from 'node:url';
    import { defineConfig } from 'vite';
    import vue from '@vitejs/plugin-vue';
    import * as babel from '@babel/core';
    
    // A very simple Vite plugin support babel transpilation
    const babelPlugin = {
      name: 'plugin-babel',
      transform: (src, id) => {
        if (/\.(jsx?|vue)$/.test(id)) {               // the pattern of the file to handle
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
        babelPlugin,                                // must after the vue plugin
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
    });
    ```
    **注意：** 在上面配置文件中我们实现了一个简单的 [Vite] 插件用于将 [vite-plugin-vue] 
    插件处理过的代码通过 [babel] 转译。虽然有个 [vite-plugin-babel] 插件声称可以让 [vite]
    支持 [babel]，但我们发现它无法正确处理 [vue] 的 SFC 格式 (`*.vue`格式文件）。仔细研究
    它的源码后，我们发现要实现正确的转译，必须在 [vite-plugin-vue] 插件处理过源码之后再使用 
    [babel] 进行转译，因此只需上面非常简单的插件函数即可实现我们需要的功能。

详细配置过程可以参考：
- 使用 [create-vue] 和 [vite] 创建的演示项目：[vue3-class-component-demo-vite]

## <span id="usage-example">使用示例</span>

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
上述代码等效于：
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

## <span id="supported-options">支持的选项</span>

`@Component` 装饰器可以与选项参数一起使用，这些选项参数将传递给生成的 Vue 组件的选项。例如：

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
上述代码等效于：
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
下表列出了Vue选项API中的所有关键词以及它们是否受 `@Component` 装饰器参数的支持：

| 类别          | 选项                | 是否支持	 | 描述                                             |
|-------------|-------------------|-------|------------------------------------------------|
| State       | `data`            | 否     | 组件的响应式状态应该定义为类字段。                              |
| State       | `props`           | 否     | 组件的属性应该定义为类字段，并使用 `@Prop` 装饰器标记。               |
| State       | `computed`        | 否     | 计算属性应该定义为类 getter。                             |
| State       | `methods`         | 否     | 组件的方法应该定义为类方法。                                 |
| State       | `watch`           | 否     | 观察者应该定义为类方法，并使用 `@Watch` 装饰器标记。                |
| State       | `emits`           | 是     | 由 Vue 组件发出的自定义事件可以在 `@Component` 的选项中声明。       |
| State       | `expose`          | 是     | 可公开的公共属性可以在 `@Component` 的选项中声明。               |
| Rendering   | `template`        | 是     | 字符串模板可以在 @Component 的选项中声明。                    |
| Rendering   | `render`          | 否     | 渲染函数应该定义为类方法。                                  |
| Rendering   | `compilerOptions` | 是     | 字符串模板的编译器选项可以在 @Component 的选项中声明。              |
| Rendering   | `slot`            | 是     | Vue 组件的插槽可以在 @Component 的选项中声明。                |
| Lifecycle   | `beforeCreate`    | 否     | beforeCreate 钩子应该定义为类方法。                       |
| Lifecycle   | `created`         | 否     | `created` 钩子应该定义为类方法。                          |
| Lifecycle   | `beforeMount`     | 否     | `beforeMount` 钩子应该定义为类方法。                      |
| Lifecycle   | `mounted`         | 否     | `mounted` 钩子应该定义为类方法。                          |
| Lifecycle   | `beforeUpdate`    | 否     | `beforeUpdate` 钩子应该定义为类方法。                     |
| Lifecycle   | `updated`         | 否     | `updated` 钩子应该定义为类方法。                          |
| Lifecycle   | `beforeUnmount`   | 否     | `beforeUnmount` 钩子应该定义为类方法。                    |
| Lifecycle   | `unmounted`       | 否     | `unmounted` 钩子应该定义为类方法。                        |
| Lifecycle   | `errorCaptured`   | 否     | `errorCaptured` 钩子应该定义为类方法。                    |
| Lifecycle   | `renderTracked`   | 否     | `renderTracked` 钩子应该定义为类方法。                    |
| Lifecycle   | `renderTriggered` | 否     | `renderTriggered` 钩子应该定义为类方法。                  |
| Lifecycle   | `activated`       | 否     | `activated` 钩子应该定义为类方法。                        |
| Lifecycle   | `deactivated`     | 否     | `deactivated` 钩子应该定义为类方法。                      |
| Lifecycle   | `serverPrefetch`  | 否     | `serverPrefetch` 钩子应该定义为类方法。                   |
| Composition | `provide`         | 否     | `provide` 属性应该定义为类字段，并使用 `@Provide` 装饰器标记。     |
| Composition | `inject`          | 否     | `inject` 属性应该定义为类字段，并使用 `@Inject` 装饰器标记。       |
| Composition | `mixins`          | 是     | 可以在 `@Component` 的选项中声明混入的对象数组。                |
| Composition | `extends`         | 是     | 可以在 `@Component` 的选项中声明要扩展的基础 Vue 组件。          |
| Misc        | `name`            | 是     | Vue 组件的名称可以在 `@Component` 的选项中声明；否则将使用装饰的类的类名。 |
| Misc        | `inheritAttrs`    | 是     | inheritAttrs 可以在 `@Component` 的选项中声明。          |
| Misc        | `components`      | 是     | Vue 组件的注册组件可以在 `@Component` 的选项中声明。            |
| Misc        | `directives`      | 是     | Vue 组件的注册指令可以在 `@Component` 的选项中声明。            |

## <span id="predefined-decorators">预定义装饰器</span>

这个库为类式 Vue 组件提供了以下常用装饰器：

- [`@Prop`](#Prop)
- [`@Watch`](#Watch)
- [`@Provid`](#Provide)
- [`@Inject`](#Inject)

### <span id="Prop">`@Prop` 装饰器</span>

`@Prop` 装饰器应用在类字段上，用于声明 Vue 组件的 props。

例如：
```js
@Component
class MyComponent {
  @Prop
  message = 'hello';

  @Prop({ type: Number, validator: (v) => (v >= 0) })
  value;

  // 非基本数据类型的默认值 **无需** 用工厂函数包装
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
上述代码等效于：
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

`@Prop` 装饰器可以有一个可选参数。`@Prop` 装饰器的参数是一个包含以下选项的对象：

| 选项          | 类型         | 默认值         | 描述                 |
|-------------|------------|-------------|--------------------|
| `type`      | `Function` | `undefined` | Prop 的数据类型，应为构造函数。 |
| `required`  | `Boolean`  | `false`     | 指示是否需要传递该 prop。    |
| `default`   | `any`      | `undefined` | 指定 prop 的默认值。      |
| `validator` | `Function` | `undefined` | 用于 prop 的自定义验证函数。  |

- `type`: 此选项定义了 prop 期望的数据类型，可以是以下之一：`String`、`Number`、
  `Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`、自定义的类、自定义的构造
  函数，或这些类型的数组。在开发模式下，Vue 会验证 prop 的值是否与声明的类型匹配，如果不匹配，
  将发出警告。有关更多详情，请参阅[属性校验]。

  请注意，具有 `Boolean` 类型的 prop 在开发和生产模式下都会影响其值的类型转换行为。有关更多
  详情，请参阅[布尔型强制转换]。

  如果未指定此选项，则库将从装饰的类字段的初始值中推断出类型。

- `default`: 使用此选项为 prop 指定默认值，当它未由父组件传递或具有未定义的值时将会生效。对
  象或数组类型的默认值必须使用工厂函数返回。工厂函数还接收原始的 prop 对象作为参数。如果未指定
  此选项，则库将自动从装饰的类字段的初始值中推断默认值。

  值得注意的是，[Vue] 库要求 prop 的非原始类型默认值必须使用工厂函数包装，但我们的库会自动处
  理此问题。因此，在声明 prop 时，不需要使用工厂函数包装非原始类型的默认值。

- `required`: 使用此选项来指定是否必须传递 prop。在非生产环境中，如果此值为真且未提供 prop，
  则会生成控制台警告。

  如果未指定此选项，则库将自动推断装饰的类字段的初始值是否已提供，以确定是否需要 prop。
- `validator`: 此选项允许您定义一个自定义验证函数，该函数以 prop 值作为其唯一参数。在开发模
  式下，如果此函数返回假值（即验证失败），则会生成控制台警告。

### <span id="Watch">`@Watch` 装饰器</span>

`@Watch` 装饰器应用在类方法上，用于声明 Vue 组件的观察者。

例如：
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
上述代码等效于：
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

`@Watch` 装饰器可以带有一个或两个参数。`@Watch` 装饰器的第一个参数是被监视的状态或属性的路径，
第二个可选参数是一个包含以下选项的对象：

| 选项          | 类型        | 默认值     | 描述                                             |
|-------------|-----------|---------|------------------------------------------------|
| `deep`      | `Boolean` | `false` | 观察者是否应深度遍历源对象（如果它是对象或数组）。                      |
| `immediate` | `Boolean` | `false` | 观察者是否应在创建后立即调用。                                |
| `flush`     | `String`  | `'pre'` | 观察者的刷新时机。可以是 `'pre'`、`'post'` 或 `'sync'` 中的一个。 |

- `deep`: 如果源对象是对象或数组，强制深度遍历，以便在发生深层变化时触发回调。
  请参阅[深度观察者]。
- `immediate`: 在观察者创建时立即触发回调。第一次调用时旧值将为 `undefined`。
  请参阅[急切观察者]。
- `flush`: 调整回调的刷新时机。可以是 `'pre'`、`'post'` 或 `'sync'` 中的一个。
  请参阅[回调刷新时机]和[watchEffect()]。

**注意：** 与 [vue-property-decorator] 中的 `@Watch` 装饰器不同，此库中的 `@Watch`
装饰器不支持使用多个观察处理程序同时监视相同的状态或属性。因为这不是常见用例，所以我们决定简
化`@Watch`装饰器的实现。

### <span id="Provide">`@Provide` 装饰器</span>

`@Provide` 装饰器应用在类字段上，用于声明可以由子组件注入的提供的值。

例如：
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
上述代码等效于：
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

`@Provide` 和 `@Inject` 装饰器一起使用，允许祖先组件作为所有后代组件的依赖注入器，无论组件
层次结构有多深，只要它们在同一父级链中。有关详细信息，请参阅[Provide / Inject]。

`@Provide` 装饰器可以带有一个可选参数。可选参数是一个包含以下选项的对象：

| 选项         | 类型                 | 默认值         | 描述          |
|------------|--------------------|-------------|-------------|
| `key`      | `String \| Symbol` | `undefined` | 提供值的键。      |
| `reactive` | `Boolean`          | `false`     | 提供值是否是响应式的。 |

- `key`: 子组件使用键来定位要注入的正确值。键可以是字符串或符号。有关更多详情，请参阅[使用符号键]。
  如果未指定此选项，则将使用由 `@Provide` 装饰器装饰的字段的名称作为键。
- `reactive`: 指示提供的值是否是响应式的。默认情况下，提供的值不是响应式的，即在祖先组件中更
  改提供的值不会影响后代组件中注入的值。如果将此选项设置为 `true`，则提供的值将变为响应式。
  有关更多详情，请参阅[使用响应式]。

**注意：** [vue-property-decorator] 提供了 `@Provide` 和 `@ProvideReactive` 装饰器，
分别用于声明非响应式和响应式的提供的值。但此库通过提供一个带有可选 `reactive` 选项的
`@Provide` 装饰器来简化实现。由于提供的值通常是非响应式的，我们决定将 `reactive` 选项的默认
值设置为 `false`。

### <span id="Inject">`@Inject` 装饰器</span>

`@Inject` 装饰器应用在类字段上，用于声明被注入的值。

例如：
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
上述代码等效于：
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
`@Provide` 和 `@Inject` 装饰器一起使用，允许祖先组件作为所有后代组件的依赖注入器，无论组件
层次结构有多深，只要它们在同一父级链中。有关详细信息，请参阅[Provide / Inject]。

`@Inject` 装饰器可以带有一个可选参数。可选参数是一个包含以下选项的对象：

| 选项        | 类型                 | 默认值         | 描述          |
|-----------|--------------------|-------------|-------------|
| `from`    | `String \| Symbol` | `undefined` | 要注入的源提供值的键。 |
| `default` | `any`              | `undefined` | 被注入值的默认值。   |

- `from`: 此选项的值指定要注入的提供值的键。键可以是字符串或符号。有关更多详情，请参阅[使用符号键]。
  如果未指定此选项，则将使用由 `@Inject` 装饰器装饰的字段的名称作为键。
- `default`: 被注入属性的默认值。请注意，类似于 `@Prop` 装饰器的 `default` 选项，此库将自
  动将非原始类型的默认值转换为工厂函数。

**注意：** 如果提供的值是非响应式的，则相应的注入值也是非响应式的。如果提供的值是响应式的，
则相应的注入值也是响应式的。有关更多详情，请参阅[使用响应式]。

**注意：** [vue-property-decorator] 提供了 `@Inject` 和 `@InjectReactive` 装饰器，
分别用于声明非响应式和响应式的注入值。但此库通过提供只有一个 `@Inject` 装饰器来简化实现，
并且注入值的响应性由提供值的响应性决定。

## <span id="customize-decorators">自定义装饰器</span>

此库提供了一个 `createDecorator()` 函数，用于创建自定义装饰器。该函数接受一个回调函数作为参
数，并返回一个装饰器函数。回调函数将使用以下参数进行调用：

- `Class`：被装饰类的构造函数。
- `defaultInstance`：被装饰类的默认构造实例。此默认实例可用于获取被装饰类的所有实例字段。
- `target`：被装饰的目标值，可以是类方法、getter 或 setter。请注意，如果被装饰的目标是类字
  段，此参数将始终为 `undefined`。
- `context`：包含有关被装饰目标的信息的上下文对象，如 [JavaScript 装饰器第3阶段提案] 和
  [JavaScript 装饰器元数据第3阶段提案] 中所述。
- `options`：Vue 组件选项对象。对此对象的更改将影响提供的组件。

此库将调用回调函数，以便给它一个机会来修改 Vue 组件选项。回调函数的返回值将被忽略。

`createDecorator()` 函数将返回一个装饰器函数，该函数接受以下两个参数：

- `target`：被装饰的目标值，可以是类方法、类字段、getter 或 setter。如果被装饰的目标是类字
  段，此参数将始终为 `undefined`。
- `context`：包含有关被装饰目标的信息的上下文对象，如 [JavaScript 装饰器第3阶段提案] 和
  [JavaScript 装饰器元数据第3阶段提案] 中所述。

以下是一个示例用法：
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
上面的示例演示了如何创建一个 `@Log` 装饰器，该装饰器可用于记录类方法的参数。例如：
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

**注意：** 上述的 @Log 装饰器不能应用于组件类的 getter 或 setter。

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
[JavaScript 装饰器第3阶段提案]: https://github.com/tc39/proposal-decorators
[JavaScript 装饰器元数据第3阶段提案]: https://github.com/tc39/proposal-decorator-metadata
[属性校验]: https://vuejs.org/guide/components/props.html#prop-validation
[布尔型强制转换]: https://vuejs.org/guide/components/props.html#boolean-casting
[深度观察者]: https://vuejs.org/guide/essentials/watchers#deep-watchers
[急切观察者]: https://vuejs.org/guide/essentials/watchers.html#eager-watchers
[回调刷新时机]: https://vuejs.org/guide/essentials/watchers#callback-flush-timing
[watchEffect()]: https://vuejs.org/api/reactivity-core#watcheffect
[Provide / Inject]: https://vuejs.org/guide/components/provide-inject.html
[使用符号键]: https://vuejs.org/guide/components/provide-inject.html#working-with-symbol-keys
[使用响应式]: https://vuejs.org/guide/components/provide-inject#working-with-reactivity
[vue3-class-component]: https://github.com/Haixing-Hu/vue3-class-component
[vue3-class-component-demo-webpack]: https://github.com/Haixing-Hu/vue3-class-component-demo-webpack
[vue3-class-component-demo-vite]: https://github.com/Haixing-Hu/vue3-class-component-demo-vite
[vite-plugin-vue]: https://www.npmjs.com/package/@vitejs/plugin-vue
[vite-plugin-babel]: https://www.npmjs.com/package/vite-plugin-babel
