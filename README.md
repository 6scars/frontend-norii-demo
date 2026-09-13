# Mini Spotify Frontend

React frontend for a full-stack Spotify-inspired music application. It provides
music discovery and playback, authentication, user playlists, recently played
tracks, and an authenticated song upload flow.

The corresponding API is maintained in the
[`backend-spotify`](https://github.com/6scars/backend-spotify) repository.

## Features

- Browse songs loaded from the backend API.
- Play audio stored in a public Supabase Storage bucket.
- Play, pause, seek, mute, change volume, loop, and move between playlist tracks.
- Keep up to six recently played songs in browser `localStorage`.
- Create an account, sign in, validate a saved JWT session, and sign out.
- Create playlists and select their initial songs.
- View playlists and play either the entire playlist or an individual track.
- Add the current song to a playlist or remove it from one.
- Upload a song, cover image, metadata, and optional album association through
  the `/addSong` view.
- Display toast notifications, loading placeholders, fallback artwork, and a
  resizable song-description panel.
- Run as a client-side routed application on Vercel.

The application currently handles music. A podcasts control is visible in the
interface, but podcast data and playback are not implemented.

## Technology

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4 and component-level CSS
- Native HTML audio
- Context providers and custom hooks for authentication, UI state, playback,
  playlists, recently played songs, and notifications
- Supabase Storage for audio files and artwork
- Vercel rewrite configuration for client-side routing

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Main music library, playlists, authentication, and player |
| `/addSong` | Song metadata, file selection, preview, and upload workflow |

## Requirements

- A recent Node.js version compatible with Vite 7 (Node.js 22 is recommended)
- npm
- A running `backend-spotify` API for functionality that reads or changes data
- Access to the configured public Supabase Storage bucket for artwork and audio

## Environment variables

Create `.env.development` for local development:

```env
VITE_BACKEND_URL=http://localhost:3005
VITE_SUPA_B_STOR=https://rgmmwhkixprkskznqjcy.supabase.co/storage/v1/object/public/spotify
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_BACKEND_URL` | No | Base URL of the Spotify API. The deployed Render API is used when omitted. |
| `VITE_SUPA_B_STOR` | No | Base URL of the public Supabase Storage bucket. The deployed bucket URL is used when omitted. |

All variables prefixed with `VITE_` are exposed to browser code. Never put a
database connection string, JWT signing secret, Supabase `sb_secret_...` key, or
other server credential in this repository.

> **Important:** without a local `VITE_BACKEND_URL`, development falls back to
> `https://spotify-backend-1-olcd.onrender.com` and can operate on the deployed
> environment instead of the local backend.

## Local development

Install frontend dependencies:

```bash
npm ci
```

Start the backend in the `backend-spotify` repository:

```bash
npm run dev
```

Start this frontend in a second terminal:

```bash
npm run dev
```

The configured local addresses are:

- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3005`

Vite automatically loads `.env.development` when `npm run dev` is used. Restart
the development server after changing an environment variable.

If a JWT from the deployed backend is already saved in the browser, sign out or
clear the `jwt` and `user_id` entries from `localStorage`, then sign in through
the local backend.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite in development mode on port `3001` |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm test` | Run the automated unit tests |

## Backend integration

The frontend currently calls these API endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/fetchSongs` | Load the music library |
| `GET` | `/api/getSong?id=...` | Load one track for playback |
| `GET` | `/api/getAuthorsAlbums` | Load albums available to the signed-in author |
| `GET` | `/api/getPlaylistData?id=...` | Load tracks assigned to a playlist |
| `POST` | `/api/newAccount` | Register an account |
| `POST` | `/api/signin` | Sign in and receive a JWT |
| `POST` | `/api/checkToken` | Validate the stored JWT session |
| `POST` | `/api/playlists` | Load a user's playlists |
| `POST` | `/api/createPlaylist` | Create a playlist with selected tracks |
| `POST` | `/api/addSongToPlaylist` | Add a track to a playlist |
| `POST` | `/api/handleRemoveSong` | Remove a track from a playlist |
| `POST` | `/api/addView` | Increment a track's play counter |
| `POST` | `/api/saveSongInBase` | Upload song metadata, MP3 audio, and cover artwork |

Authenticated requests read the JWT from browser `localStorage` and send it in
the `Authorization` header, except for the multipart song upload where the
current implementation also includes the token in `FormData`.

## State and data flow

```text
React views
    |
    +-- Context providers and custom hooks
    |       |-- authentication and playlists
    |       |-- current track and playlist position
    |       |-- audio player state
    |       |-- UI panels and notifications
    |       `-- recently played tracks
    |
    +-- backend-spotify API
    |       `-- authentication, songs, playlists, and uploads
    |
    `-- public Supabase Storage
            `-- audio, artwork, fallback images, and player icons
```

The browser stores `jwt`, `user_id`, and `latest` keys in `localStorage`.

## Production deployment

`vercel.json` rewrites all application routes to `index.html`, allowing React
Router paths such as `/addSong` to work after a direct navigation or page
refresh. Configure `VITE_BACKEND_URL` and `VITE_SUPA_B_STOR` in the deployment
environment before building if the default deployed services should not be
used.

## Track details panel

On screens at least 768 px wide, selecting a track opens a docked panel on
the right. Below 768 px, selecting a track only starts playback; its artwork
or title in the bottom player opens the details view, sliding in from the right.
The back/collapse button stays visible while the details scroll. Closing the
panel preserves the underlying page and its scroll position without restarting
the audio. Escape also closes the panel and restores keyboard focus.

The panel uses the existing artist routes and playlist API. Missing artwork,
biography and credits have explicit fallback states. Favorites remain disabled
until the backend supports them. The full player is available through the link
at the bottom of the details panel.

`src/widgets/Center/DescriptionDrawer.jsx` owns panel behavior and focus;
`Description.jsx` renders track details and playlist actions. `AppShell` owns
the docked layout. Global styling controls live in `src/App.css`:
`--description-width`, `--description-motion` and `--description-layer`.
Reduced-motion preferences disable the sliding animation.

## Current limitations

- The frontend requires the separate backend for real data and mutations.
- Podcast functionality is not implemented.
- Authentication state is stored in `localStorage`.
- The production build and unit tests pass; ESLint reports existing hook
  dependency warnings in the application source.
