import fg from 'fast-glob'
import { dirname } from "path";
import MagicString from "magic-string";
import { parse } from 'acorn'
import type { Literal, ArrayExpression, ObjectExpression } from 'estree'
import type { TransformPluginContext } from 'rollup'
import { ViteAliasOptions, Alias } from '../types';
import { isString, isRegExp } from '../shared';


const importGlobRE = /\b@?(?:import|export)(?:.*)(['|"].*['|"])/g

function matchImport(code: string, id: string) {
  if (!id.includes('node_modules'))
    return Array.from(code.matchAll(importGlobRE)).filter(match => match[1].length > 0)
  return []
}

function resolveReplacement(s: MagicString, entry: Alias, start: number, end: number) {
  s.overwrite(start, end, entry.replacement)
}

function setRange(s: MagicString, entry: Alias, match: RegExpMatchArray, originalString: string, checkStart: string | number, checkEnd: string) {
  const start = match.index! + originalString.indexOf(checkStart as string)
  const end = start + checkEnd.length
  resolveReplacement(s, entry, start, end)
}


function replacement(s: MagicString, match: RegExpMatchArray, { entries }: ViteAliasOptions) {
  const originalString = match[0]
  const argumentString = match[1]

  for (const entry of entries as Alias[]) {
    if (isRegExp(entry.find) && argumentString.match(entry.find)) {
      setRange(s, entry, match, originalString, argumentString.slice(1, -1), argumentString.slice(1, -1))
    }
    else if (isString(entry.find) && originalString.includes(entry.find)) {
      setRange(s, entry, match, originalString, entry.find, entry.find)
    }
  }
}

export async function transform(
  code: string,
  id: string,
  options: ViteAliasOptions
) {
  const maths = matchImport(code, id)

  if (!maths.length) {
    return
  }

  const s = new MagicString(code)

  for (const match of maths) {
    replacement(s, match, options)
  }
  return {
    code: s.toString(),
    map: s.generateMap()
  }

}