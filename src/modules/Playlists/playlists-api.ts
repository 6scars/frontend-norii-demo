import { requestJson } from '../../shared/api/request.ts'
import type {
  EntityId,
  MessageResponse,
  Playlist,
  Song,
} from '../../shared/types/domain.ts'

interface PlaylistsResponse {
  data?: Playlist[]
}

interface PlaylistDetailsResponse {
  data?: Song[]
}

interface CreatePlaylistInput {
  name: string
  trackIds: EntityId[]
}

interface UpdatePlaylistTrackInput {
  isIncluded: boolean
  playlistId: EntityId
  trackId: EntityId
}

export async function fetchUserPlaylists(
  userId: EntityId | null,
): Promise<Playlist[]> {
  if (userId == null || userId === '') return []

  const payload = await requestJson<PlaylistsResponse>('/api/playlists', {
    json: { id: userId },
    method: 'POST',
  })
  return Array.isArray(payload?.data) ? payload.data : []
}

export function createPlaylist(
  { name, trackIds }: CreatePlaylistInput,
  token: string | null,
): Promise<MessageResponse> {
  return requestJson<MessageResponse>('/api/createPlaylist', {
    json: {
      playlistName: name,
      songsToAddArray: trackIds,
    },
    method: 'POST',
    token,
  })
}

export function updatePlaylistTrack(
  { isIncluded, playlistId, trackId }: UpdatePlaylistTrackInput,
  token: string | null,
): Promise<MessageResponse> {
  const endpoint = isIncluded ? 'handleRemoveSong' : 'addSongToPlaylist'
  return requestJson<MessageResponse>(`/api/${endpoint}`, {
    json: {
      playlist_id: playlistId,
      song_id: trackId,
    },
    method: 'POST',
    token,
  })
}

export async function fetchPlaylistDetails(
  playlistId: EntityId,
  signal?: AbortSignal,
): Promise<Song[]> {
  const options = signal ? { signal } : {}
  const payload = await requestJson<PlaylistDetailsResponse>(
    `/api/getPlaylistData?id=${encodeURIComponent(String(playlistId))}`,
    options,
  )
  return Array.isArray(payload?.data) ? payload.data : []
}
