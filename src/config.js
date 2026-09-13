const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const BACKEND_URL = trimTrailingSlash(
  import.meta.env?.VITE_BACKEND_URL || "http://site--norii-demo--cw7dcmybzfm4.code.run"
);

export const SUPABASE_STORAGE_URL = trimTrailingSlash(
  import.meta.env?.VITE_SUPA_B_STOR || "https://uudncwmhipchzdmuocup.supabase.co/storage/v1/object/public/spotify/"
);
