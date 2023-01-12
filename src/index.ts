import type { Plugin } from "vite";
import type { ViteAliasOptions } from "../types";
import { transform } from './transform'


export function getEntries(options: ViteAliasOptions): ViteAliasOptions {
  let { entries } = options

  if (!entries)
    return {}

  if (Array.isArray(entries)) {
    options.entries = entries.map(entry => {
      return {
        find: new RegExp(entry.find),
        replacement: entry.replacement
      }
    })
  } else if (!Array.isArray(entries)) {
    options.entries = Object.entries(entries).map(([key, value]) => {
      return { find: key, replacement: value };
    });
  }

  return options
}

export default function Alias(options: ViteAliasOptions = {}): Plugin {
  options = getEntries(options);

  return {
    name: 'vite-plugin-alias',
    transform(code, id) {
      return transform(code, id, options)
    }
  }
}