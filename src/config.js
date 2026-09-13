const trimTrailingSlash = (value) => value.replace(/\/$/, "");

export const BACKEND_URL = trimTrailingSlash(
  import.meta.env?.VITE_BACKEND_URL || "http://localhost:3005"
);

export const SUPABASE_STORAGE_URL = trimTrailingSlash(
  import.meta.env?.VITE_SUPA_B_STOR || ""
);
