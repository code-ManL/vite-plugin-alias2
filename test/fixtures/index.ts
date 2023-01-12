import '@vue/shared'
import '~/style.css'
import '~/da'
import 'index.js'
// @ts-expect-error let me do it
import * as m from 'index.js'
import { a } from './index'
// @ts-expect-error let me do it
export { a } from './index'
// @ts-expect-error let me do it
export { default as m } from './index'
export *  from './index'