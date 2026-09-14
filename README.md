# Nyori demo frontend

Frontend aplikacji muzycznej napisany w React 19 i TypeScript. Vite buduje aplikację, React Router obsługuje trasy, a backend udostępnia katalog, sesje, playlisty i publikowanie utworów. Publiczne pliki audio i okładki są pobierane z Supabase Storage.

## Wymagania i uruchomienie

- Node.js zgodny z Vite 7 (zalecany Node.js 22)
- npm
- dostęp do backendu i publicznego bucketa Storage

```bash
npm ci
npm run dev
```

Serwer deweloperski działa na `http://localhost:3201`. Zmienne środowiskowe można ustawić w `.env.development` na podstawie `.env.example`:

| Zmienna | Znaczenie |
| --- | --- |
| `VITE_BACKEND_URL` | Bazowy adres API backendu. |
| `VITE_SUPA_B_STOR` | Publiczny adres bucketa Supabase Storage. |

Gdy zmienne nie są ustawione, [konfiguracja](src/config.ts) używa adresów demonstracyjnych. Przed uruchomieniem własnego backendu lub wdrożeniem ustaw obie zmienne świadomie. Prefiks `VITE_` oznacza, że wartości są dostępne w przeglądarce; nigdy nie umieszczaj w nich sekretów serwera.

## Kontrola jakości

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`typecheck` uruchamia TypeScript w trybie ścisłym. `lint` sprawdza również reguły React Hooks i typowany ESLint. Testy Node są napisane w TypeScript i uruchamiane przez `tsx`. `build` najpierw sprawdza typy, potem tworzy katalog `dist/`.

## Struktura

- `src/app/` — trasy, dostawcy kontekstu i układ aplikacji.
- `src/modules/` — logika domenowa, API, modele oraz stan.
- `src/pages/` — widoki tras.
- `src/widgets/` — większe elementy interfejsu, w tym odtwarzacz i upload.
- `src/shared/` — typy, wspólne komponenty i klient HTTP.
- `tests/` — testy modeli, kontraktów HTTP i zachowania interfejsu.

Kluczowe trasy to `/`, `/discover`, `/library`, `/playlists`, `/my-songs`, `/account`, `/login` i `/addSong`. Vercel kieruje bezpośrednie wejścia na trasy aplikacji do `index.html` przez `vercel.json`.

Publikowanie utworu wymaga zalogowania, poprawnych plików MP3 (do 25 MB) oraz JPG/PNG (do 5 MB) i potwierdzenia praw do materiałów. Formularz wysyła dane do backendu; ostateczna walidacja i limity wersji demo są egzekwowane po stronie backendu. Funkcje ulubionych, obserwowania twórców i podcastów nie są jeszcze dostępne.
