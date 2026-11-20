import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

type Variant = 'gold' | 'ghost' | 'ivory' | 'navy'

const styles: Record<Variant, string> = {
  gold: 'bg-gold text-navy hover:bg-gold-2',
  ghost: 'border border-gold/50 text-ivory hover:bg-gold/10',
  ivory: 'bg-ivory text-navy hover:bg-white',
  navy: 'bg-navy text-ivory hover:bg-navy-2',
}

type Props = {
  children: ReactNode
  variant?: Variant
  className?: string
  to?: string
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>

export function Button({ children, variant = 'gold', className = '', to, href, ...rest }: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition duration-300 ${styles[variant]} ${className}`
  if (to) {
    return (
      <Link className={cls} to={to} onClick={rest.onClick}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a className={cls} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
