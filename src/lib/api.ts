const jsonHeaders = { 'Content-Type': 'application/json' }

async function parse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export function api<T>(path: string, init?: RequestInit) {
  return fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : jsonHeaders),
      ...init?.headers,
    },
  }).then((res) => parse<T>(res))
}
