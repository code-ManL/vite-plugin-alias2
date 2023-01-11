import type { Plugin, PluginHooks } from 'vite';

export interface Alias {
  find: string | RegExp;
  replacement: string;
}

export interface ViteAliasOptions {
  entries?: { [find: string]: string } | Alias[];
}

export default function viteAlias(options?: ViteAliasOptions): Plugin;