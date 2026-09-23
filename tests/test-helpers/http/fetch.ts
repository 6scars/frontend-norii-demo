export function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  return input instanceof URL ? input.href : input.url
}

export function parseRequestBody(options?: RequestInit): unknown {
  if (typeof options?.body !== 'string') throw new TypeError('Expected a JSON request body')
  return JSON.parse(options.body)
}
