import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../../components/brand/Logo'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/content', label: 'Website content' },
  { to: '/admin/hours', label: 'Opening hours' },
  { to: '/admin/contact', label: 'Contact' },
  { to: '/admin/facilities', label: 'Facilities' },
  { to: '/admin/plans', label: 'Membership' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/seats', label: 'Seat layout' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/enquiries', label: 'Enquiries' },
]

export function AdminLayout() {
  const { ready, authenticated, logout, username } = useAuth()
  if (!ready) return <div className="min-h-screen bg-navy p-10 text-ivory">Loading…</div>
  if (!authenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-ivory text-navy lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-navy/10 bg-navy px-4 py-6 text-ivory lg:min-h-screen lg:border-b-0">
        <Logo light markClassName="h-8 w-8" />
        <p className="mt-4 text-xs text-mist">Signed in as {username}</p>
        <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-gold text-navy' : 'text-ivory/80 hover:text-gold'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={() => void logout()} className="mt-6 text-sm text-gold">Sign out</button>
      </aside>
      <div className="p-5 sm:p-8">
        <Outlet />
      </div>
    </div>
  )
}
