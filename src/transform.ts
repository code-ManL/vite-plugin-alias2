import MagicString from "magic-string";
import { ViteAliasOptions, Alias } from '../types';

const importGlobRE = /\b@?(?:import|export)(?:.*)['|"](.*)['|"]/g

function matchImport(code: string, id: string) {
  if (!id.includes('node_modules'))
    return Array.from(code.matchAll(importGlobRE)).filter(match => match[1].length > 0)
  return []
}

function resolveReplacement(
  s: MagicString,
  entry: Alias,
  start: number,
  end: number,
): void {

  s.overwrite(start, end, entry.replacement)
}

function setRange(
  s: MagicString,
  entry: Alias,
  match: RegExpMatchArray,
  originalString: string,
  argumentString: string,
  entryMatch: RegExpMatchArray
): void {

  const start: number = match.index! + originalString.indexOf(argumentString as string)
  let end: number
  if (entry.replacement.includes('$1')) {
    entry.replacement = entry.replacement.replace(/\$1/, entryMatch[1])
    end = start + argumentString.length
    resolveReplacement(s, entry, start, end)
  }
  else {
    if (argumentString.indexOf(entryMatch[0]) === 0){
      end = start + entryMatch[0].length
      resolveReplacement(s, entry, start, end)
    }
  }
}

function replacement(
  s: MagicString,
  match: RegExpMatchArray,
  { entries }: ViteAliasOptions
): void {

  const originalString = match[0]
  const argumentString = match[1]

  for (const entry of entries as Alias[]) {
    const entryMatch = argumentString.match(entry.find)
    if (entryMatch) {
      setRange(s, entry, match, originalString, argumentString, entryMatch)
    }
  }
}

export async function transform(
  code: string,
  id: string,
  options: ViteAliasOptions
) {
  if (!options.entries)
    return
  
  const matchs = matchImport(code, id)

  if (!matchs.length) {
    return
  }

  const s = new MagicString(code)

  for (const match of matchs) {
    replacement(s, match, options)
  }

  return {
    code: s.toString(),
    map: s.generateMap()
  }

}