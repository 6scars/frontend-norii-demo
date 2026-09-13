import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url))
const allowedBreakpoints = new Set([560, 768, 1024, 1280])
const sourceExtensions = new Set(['.css', '.js', '.jsx'])

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return collectSourceFiles(path)
    return sourceExtensions.has(extname(entry.name)) ? [path] : []
  })
}

test('responsywny interfejs korzysta wyłącznie z czterech wspólnych breakpointów', () => {
  const invalidDeclarations = []

  for (const file of collectSourceFiles(sourceRoot)) {
    const source = readFileSync(file, 'utf8')
    const cssQueries = source.matchAll(/(?:@media|@container)[^{\n]*(?:max-width:\s*|width\s*<\s*)(\d+)px/g)
    const javascriptQueries = source.matchAll(/['"]\((?:max-width:\s*|width\s*<\s*)(\d+)px\)['"]/g)
    const responsiveQueries = [...cssQueries, ...javascriptQueries]

    for (const match of responsiveQueries) {
      const breakpoint = Number(match[1])
      if (!allowedBreakpoints.has(breakpoint)) {
        invalidDeclarations.push(`${relative(sourceRoot, file)}: ${breakpoint}px`)
      }
    }
  }

  assert.deepEqual(invalidDeclarations, [])
})
