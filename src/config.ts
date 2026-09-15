function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '')
}

function readEnvironmentString(name: string): string | undefined {
  const environment: unknown = (import.meta as { readonly env?: unknown }).env
  if (!environment || typeof environment !== 'object') return undefined

  const value = (environment as Record<string, unknown>)[name]
  return typeof value === 'string' ? value : undefined
}

export const BACKEND_URL = trimTrailingSlash(
  readEnvironmentString('VITE_BACKEND_URL')
    || 'https://site--norii-demo--cw7dcmybzfm4.code.run',
)

export const SUPABASE_STORAGE_URL = trimTrailingSlash(
  readEnvironmentString('VITE_SUPA_B_STOR')
    || 'https://uudncwmhipchzdmuocup.supabase.co/storage/v1/object/public/spotify/',
)
