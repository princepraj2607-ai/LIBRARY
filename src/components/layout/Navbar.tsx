import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/membership', label: 'Membership' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const solid = pathname !== '/'

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? 'bg-navy/95 shadow-lg shadow-black/20 backdrop-blur' : 'bg-navy/40 backdrop-blur-md'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" onClick={() => setOpen(false)} aria-label="VISIONPLUS LIBRARY home">
          <Logo light />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition ${isActive ? 'text-gold' : 'text-ivory/80 hover:text-gold'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button to="/book" className="!py-2.5 !px-5">Book a Seat</Button>
        </nav>
        <button
          className="rounded-full border border-gold/40 p-2 text-ivory lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-navy px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-ivory/90"
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/book" onClick={() => setOpen(false)}>Book a Seat</Button>
          </div>
        </div>
      )}
    </header>
  )
}
