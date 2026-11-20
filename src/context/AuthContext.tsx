import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'

type AuthContextValue = {
  ready: boolean
  authenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  const check = async () => {
    try {
      const me = await api<{ username: string }>('/api/auth/me')
      setAuthenticated(true)
      setUsername(me.username)
    } catch {
      setAuthenticated(false)
      setUsername(null)
    } finally {
      setReady(true)
    }
  }

  useEffect(() => {
    void check()
  }, [])

  const login = async (user: string, password: string) => {
    await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: user, password }),
    })
    await check()
  }

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' })
    setAuthenticated(false)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ ready, authenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
