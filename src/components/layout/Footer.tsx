import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { useSite } from '../../context/SiteContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/membership', label: 'Membership' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
  { to: '/book', label: 'Book a Seat' },
]

export function Footer() {
  const { site } = useSite()
  const content = site?.content
  const socials = site?.socials ?? []

  return (
    <footer className="border-t border-white/10 bg-navy text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mist">
            A peaceful study and reading library in Patan, Gujarat — created for students who want focus, comfort and a quiet place to work.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">Navigate</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-gold">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.28em] text-gold uppercase">Visit</p>
          <div className="mt-4 space-y-2 text-sm leading-relaxed text-ivory/80">
            {content?.addressLines.map((line) => <p key={line}>{line}</p>)}
            <p>{content?.city}, {content?.state} {content?.postalCode}</p>
            {content?.phoneDisplay && (
              <p>
                <a className="hover:text-gold" href={`tel:+${content.phoneE164}`}>{content.phoneDisplay}</a>
              </p>
            )}
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((item) => (
                <a key={item.id} href={item.url} className="text-sm text-gold hover:underline" target="_blank" rel="noreferrer">
                  {item.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-mist">
        © {new Date().getFullYear()} VISIONPLUS LIBRARY, Patan. All rights reserved.
      </div>
    </footer>
  )
}
