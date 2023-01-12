# vite alias Enhanced version


During the development process, there are a small number of special cases where the path substitution of Vite's native alis is not enough to meet the development needs.So this is again an enhanced version of the foundation, and the plugin is compatible with Vite's native alias

### Download address

npm i vite-plugin-alias

### 插件用法

The plugin supports vue ts tsx js css scss less json ... files
The plugin accepts two parameter formats

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
// Array form
plugins: [Alias({
    entries: [
      { find: '~', replacement: 'src' },  
      { find: '~/style.css', replacement: './style.css' }, 
      { find: "^@vue/(.*?)$", replacement: 'src/$1/src' }, 
      { find: /^(.*)\.js$/, replacement: '$1.wasm' }, 
    ],
  })],

// Object shorthand is supported
plugins: [Alias({
    entries: {
      '~': '.',
      '~/style.css': './style.css',
      "^@vue/(.*?)$": 'src/$1/src',
    }
  })],


```

### The case is as follows

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

After compilation, the code wrapped in conditional comments will replace the path

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
