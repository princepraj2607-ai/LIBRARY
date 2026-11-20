import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Logo } from '../../components/brand/Logo'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { Seo } from '../../components/seo/Seo'

export function AdminLogin() {
  const { authenticated, ready, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (ready && authenticated) return <Navigate to="/admin" replace />

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <Seo title="Admin | VISIONPLUS LIBRARY" description="Administrator sign in for VISIONPLUS LIBRARY." path="/admin/login" />
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-ivory p-8 text-navy">
        <Logo />
        <h1 className="mt-8 font-serif text-4xl">Administrator</h1>
        <p className="mt-2 text-sm text-navy/60">Sign in to manage the website, seats and bookings.</p>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="mt-8 w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" placeholder="Password" />
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" className="mt-6 w-full">Sign in</Button>
      </form>
    </div>
  )
}
