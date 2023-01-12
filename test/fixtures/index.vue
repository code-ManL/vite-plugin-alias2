  <!-- Mr.Liu -->
<template>
    <div>

    </div>
</template>

<script setup lang='ts'>
import '@vue/shared'
import '~/da'
import 'index.js'
// @ts-expect-error let me do it
import * as m from 'index.js'
import { a } from './index'
</script>

<style lang='scss' scoped>
  @import '~/style.css'
</style>