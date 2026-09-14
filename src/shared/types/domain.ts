export type EntityId = string | number

export interface Song {
  id?: EntityId | null
  song_id?: EntityId | null
  song_name?: string | null
  songName?: string
  song_image?: string | null
  songImage?: string | null
  author?: string | null
  author_image?: string | null
  album_name?: string | null
  credit?: string | null
  biograph?: string | null
  follows?: number | string | null
  views?: number | string | null
  file?: string | null
  lyrics?: string | null
  song_text?: string | null
  createdAt?: string | null
  name?: string | null
  playlist_name?: string | null
}

export interface Playlist {
  playlist_id?: EntityId | null
  playlist_name?: string | null
  song_ids?: Array<EntityId | null>
  song_images?: Array<string | null> | null
}

export interface Album {
  id: EntityId
  album_name: string
}

export interface Session {
  token: string | null
  userId: string | null
}

export interface MessageResponse {
  message?: string
}

export interface AuthResponse extends MessageResponse {
  token?: string
  user_id?: EntityId
}

export interface PublicationConsent {
  audioRightsConfirmed: boolean
  coverRightsConfirmed: boolean
  publishingTermsAccepted: boolean
}

export interface DemoPublishingStatus {
  isDemo: true
  message?: string
  canPublish: boolean
  publicationTtlMinutes: number
  publications: {
    used: number
    limit: number
  }
  storage: {
    usedBytes: number
    limitBytes: number
  }
}

