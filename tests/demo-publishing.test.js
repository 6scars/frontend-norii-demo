import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getDemoPublishingNotice } from '../src/modules/Upload/song-upload.js'
import { fetchDemoPublishingStatus } from '../src/modules/Upload/upload-api.js'

test('loads demo publishing status with the authenticated request', async () => {
  const originalFetch = globalThis.fetch
  let request

  const status = {
    isDemo: true,
    canPublish: true,
    publicationTtlMinutes: 15,
    publications: { used: 0, limit: 2 },
    storage: { usedBytes: 100, limitBytes: 500 },
  }
  globalThis.fetch = async (url, options) => {
    request = { url, options }
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    assert.deepEqual(await fetchDemoPublishingStatus('signed-token'), status)
    assert.match(request.url, /\/api\/demo-publishing-status$/)
    assert.equal(new Headers(request.options.headers).get('Authorization'), 'Bearer signed-token')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('builds a clear demo notice from the backend policy status', () => {
  assert.equal(getDemoPublishingNotice({
    publicationTtlMinutes: 15,
    publications: { used: 1, limit: 2 },
  }), 'Wersja demonstracyjna: wykorzystano 1 z 2 publikacji. Utwory i pliki są automatycznie usuwane po 15 minutach.')
})
test('rejects malformed demo publishing status before the UI uses it', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ canPublish: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

  try {
    await assert.rejects(
      fetchDemoPublishingStatus('signed-token'),
      /nieprawidłowy status publikowania/
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
