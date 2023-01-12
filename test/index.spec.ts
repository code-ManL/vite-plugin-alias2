import { resolve } from 'path';
import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { transform } from '../src/transform'


describe('should', async () => {
  const id = resolve(__dirname, './fixtures/index.ts')
  const code = await fs.promises.readFile(id, 'utf-8')

  const options = {
    entries: [
      // { find: '~', replacement: '.' },
      { find: '~/style.css', replacement: './style.css' },
      { find: "^@vue/(.*?)$", replacement: '<rootDir>/packages/$1/src' },
      // { find: /^(.*)\.js$/, replacement: '$1.wasm' },
      // { find: /d(b+)d/, replacement: './fixtures/b' },
    ],
  }


  it("transform", async () => {
    expect((await transform(code, id, options))?.code).toMatchInlineSnapshot(`
      "import '<rootDir>/packages/shared/src'
      import './style.css'"
    `)
  })
})

// 判断有没有捕获组，没有捕获组就直接替换第一个