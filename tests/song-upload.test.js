import test from 'node:test'
import assert from 'node:assert/strict'

import {
  MAX_AUDIO_BYTES,
  MAX_IMAGE_BYTES,
  PUBLISHING_POLICY_VERSION,
  validateAudioFile,
  validateImageFile,
  validateSongUpload,
} from '../src/modules/Upload/song-upload.ts'

const imageFile = { name: 'cover.png', type: 'image/png', size: 1024 }
const audioFile = { name: 'song.mp3', type: 'audio/mpeg', size: 1024 }
const publicationConsent = {
  audioRightsConfirmed: true,
  coverRightsConfirmed: true,
  publishingTermsAccepted: true,
  policyVersion: PUBLISHING_POLICY_VERSION,
}

test('formularz utworu akceptuje kompletny zestaw JPG/PNG i MP3', () => {
  assert.deepEqual(validateSongUpload({ song_name: 'Cienie', imageFile, audioFile, publicationConsent }), {})
  assert.deepEqual(validateSongUpload({
    song_name: 'Cienie',
    imageFile: { ...imageFile, name: 'cover.jpg', type: 'image/jpeg' },
    audioFile,
    publicationConsent,
  }), {})
})

test('formularz utworu zwraca błędy braków i nieprawidłowych formatów', () => {
  assert.deepEqual(validateSongUpload({
    song_name: 'abc',
    imageFile: { name: 'cover.webp', type: 'image/webp', size: 1024 },
    audioFile: { name: 'song.wav', type: 'audio/wav', size: 1024 },
    publicationConsent: {},
  }), {
    song_name: 'Tytuł musi mieć co najmniej 5 znaków.',
    imageFile: 'Okładka musi być plikiem JPG lub PNG.',
    audioFile: 'Nagranie musi być plikiem MP3.',
    audioRightsConfirmed: 'Potwierdź prawa do nagrania.',
    coverRightsConfirmed: 'Potwierdź prawa do okładki.',
    publishingTermsAccepted: 'Zaakceptuj zasady publikowania.',
  })
})

test('formularz podaje osobne komunikaty dla przekroczonych limitów', () => {
  assert.equal(
    validateAudioFile({ ...audioFile, size: MAX_AUDIO_BYTES + 1 }),
    'Nagranie jest za duże. Maksymalny rozmiar to 25 MB.'
  )
  assert.equal(
    validateImageFile({ ...imageFile, size: MAX_IMAGE_BYTES + 1 }),
    'Okładka jest za duża. Maksymalny rozmiar to 5 MB.'
  )
})
