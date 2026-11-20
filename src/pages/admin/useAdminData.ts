import { useCallback, useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { Database } from '../../lib/types'

export function useAdminData() {
  const [data, setData] = useState<Database | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const next = await api<Database>('/api/admin/data')
    setData(next)
  }, [])

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
  }, [load])

  const save = async <T,>(path: string, body: unknown, method = 'PUT') => {
    setSaving(true)
    setError('')
    try {
      const result = await api<T>(path, { method, body: JSON.stringify(body) })
      await load()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      throw err
    } finally {
      setSaving(false)
    }
  }

  return { data, setData, error, saving, load, save }
}
