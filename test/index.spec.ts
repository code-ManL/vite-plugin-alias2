import { resolve } from 'path';
import { describe, expect, it, test } from 'vitest'
import fs from 'fs'
import { transform } from '../src/transform'
import { getEntries } from '../src';


describe.only('ts', async () => {
  const id = resolve(__dirname, './fixtures/index.ts')
  const code = await fs.promises.readFile(id, 'utf-8')

  const options_Ary = {
    entries: [
      { find: '~', replacement: '.' },
      { find: '~/style.css', replacement: './style.css' },
      { find: "^@vue/(.*?)$", replacement: 'src/$1/src' },
      { find: /^(.*)\.js$/, replacement: '$1.wasm' },
    ],
  }

  // it("transformTsOrTsx_Array", async () => {
  //   expect((await transform(code, id, options_Ary))?.code).toMatchInlineSnapshot(`
  //     "import 'src/shared/src'
  //     import './style.css'
  //     import './da'
  //     import 'index.wasm'
  //     // @ts-expect-error let me do it
  //     import * as m from 'index.wasm'
  //     import { a } from './index'
  //     // @ts-expect-error let me do it
  //     export { a } from './index'
  //     // @ts-expect-error let me do it
  //     export { default as m } from './index'
  //     export *  from './index'"
  //   `)
  // })

  let options_Obj: any = {
    entries: {
      '~': '.',
      '~/style.css': './style.css',
      "^@vue/(.*?)$": 'src/$1/src',
    },
  }

  it.only("transformTsOrTsx_Object", async () => {
    options_Obj = getEntries(options_Obj)
    expect((await transform(code, id, options_Obj))?.code).toMatchInlineSnapshot(`
      "import 'src/shared/src'
      import './style.css'
      import './da'
      import 'index.js'
      // @ts-expect-error let me do it
      import * as m from 'index.js'
      import { a } from './index'
      // @ts-expect-error let me do it
      export { a } from './index'
      // @ts-expect-error let me do it
      export { default as m } from './index'
      export *  from './index'"
    `)
  })

})

describe('vue', async () => {
  const id = resolve(__dirname, './fixtures/index.vue')
  const code = await fs.promises.readFile(id, 'utf-8')

  const options = {
    entries: [
      { find: '~', replacement: '.' },
      { find: '~/style.css', replacement: './style.css' },
      { find: "^@vue/(.*?)$", replacement: 'src/$1/src' },
      { find: /^(.*)\.js$/, replacement: '$1.wasm' },
    ],
  }

  it("transformVue", async () => {
    expect((await transform(code, id, options))?.code).toMatchInlineSnapshot(`
      "  <!-- Mr.Liu -->
      <template>
          <div>

          </div>
      </template>

      <script setup lang='ts'>
      import 'src/shared/src'
      import './da'
      import 'index.wasm'
      // @ts-expect-error let me do it
      import * as m from 'index.wasm'
      import { a } from './index'
      </script>

      <style lang='scss' scoped>
        @import './style.css'
      </style>"
    `)
  })
})

// 判断有没有捕获组，没有捕获组替换第一个