import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import type { PublicSite } from '../lib/types'

type SiteContextValue = {
  site: PublicSite | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<PublicSite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    try {
      const data = await api<PublicSite>('/api/public/site')
      setSite(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load site content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <SiteContext.Provider value={{ site, loading, error, refresh }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used within SiteProvider')
  return ctx
}
