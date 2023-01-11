import type { Plugin } from "vite";
import type { ViteAliasOptions } from "../types";
import { transform } from './transform'
import { isArray } from "../shared";


function getEntries(options: ViteAliasOptions): ViteAliasOptions {
  let { entries } = options

  if (!entries)
    return {}

  if (!isArray(entries)) {
    let option: ViteAliasOptions = {}

    entries = Object.entries(entries).map(([key, value]) => {
      return { find: key, replacement: value };
    });

    option.entries = entries

    return option
  }

  return options
}


export default function (options: ViteAliasOptions = {}): Plugin {
  options = getEntries(options);
  
  return {
    name: 'vite-plugin-alias',
    transform(code, id) {
      return transform(code, id, options)
    }
  }
}