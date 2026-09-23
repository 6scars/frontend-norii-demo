import assert from 'node:assert/strict'
import test from 'node:test'

import { getSongId } from '../../../src/modules/Catalog/song.ts'

await test('getSongId obsługuje oba identyfikatory używane w aktualnym projekcie', () => {
  assert.equal(getSongId({ song_id: 7 }), 7)
  assert.equal(getSongId({ id: 8 }), 8)
  assert.equal(getSongId(null), null)
})
