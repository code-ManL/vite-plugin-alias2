# vite alias 加强版

在开发过程中，有一小部分特殊情况，vite 原生的 alis 的路径替换不足以满足开发需求，
因此这是再次基础上的加强版，并且该插件兼容 vite 原生的 alias

### 下载地址

npm i vite-plugin-alias

### 插件用法

该插件支持 vue ts tsx js css scss less json ... 文件
该插件接受两种参数格式

```ts
export interface Alias {
  find: string | RegExp;
  replacement: string;
}

export interface ViteAliasOptions {
  entries?: { [find: string]: string } | Alias[];
}
```

vite.config.ts

```ts

import Alias from 'vite-plugin-alias'
// 数组形式
plugins: [Alias({
    entries: [
      { find: '~', replacement: 'src' },  // 替换 ~
      { find: '~/style.css', replacement: './style.css' }, // 替换 ~/style.css
      { find: "^@vue/(.*?)$", replacement: 'src/$1/src' }, // 字符串正则匹配
      { find: /^(.*)\.js$/, replacement: '$1.wasm' }, // 正则匹配
    ],
  })],

// 支持对象简写方式
plugins: [Alias({
    entries: {
      '~': '.',
      '~/style.css': './style.css',
      "^@vue/(.*?)$": 'src/$1/src',
    }
  })],


```

### 案例如下

```vue
<template>
  <div></div>
</template>

<script setup lang="ts">
import "@vue/shared";
import "~/da";
import "index.js";
import * as m from "index.js";
import { a } from "./index";
</script>

<style lang="scss" scoped>
@import "~/style.css";
</style>
```

编译之后 被条件注释包裹的代码将会在生产环境删除

```vue
<template>
  <div></div>
</template>

<script setup lang="ts">
import "src/shared/src";
import "./da";
import "index.wasm";
import * as m from "index.wasm";
import { a } from "./index";
</script>

<style lang="scss" scoped>
@import "./style.css";
</style>
"
```
