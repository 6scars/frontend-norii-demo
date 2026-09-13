const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const BACKEND_URL = trimTrailingSlash(
  import.meta.env?.VITE_BACKEND_URL || "https://spotify-backend-1-olcd.onrender.com"
);

export const SUPABASE_STORAGE_URL = trimTrailingSlash(
  import.meta.env?.VITE_SUPA_B_STOR ||
    "https://rgmmwhkixprkskznqjcy.supabase.co/storage/v1/object/public/spotify"
);
