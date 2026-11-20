type LogoProps = {
  className?: string
  markClassName?: string
  light?: boolean
}

export function Logo({ className = '', markClassName = 'h-10 w-10', light = false }: LogoProps) {
  const text = light ? 'text-ivory' : 'text-navy'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg className={markClassName} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="45" height="45" rx="4" stroke="#c4a35a" strokeWidth="1.5" />
        <path d="M12 16h24v2.2H12V16Zm0 14h24v2.2H12V30Z" fill="#c4a35a" />
        <path d="M16.5 18.5 24 32.2 31.5 18.5" stroke="#c4a35a" strokeWidth="1.6" />
        <circle cx="24" cy="15" r="1.6" fill="#c4a35a" />
      </svg>
      <span className={`leading-tight ${text}`}>
        <span className="block font-serif text-[1.15rem] font-semibold tracking-[0.18em]">VISIONPLUS</span>
        <span className="block text-[0.65rem] font-medium tracking-[0.42em] text-gold">LIBRARY</span>
      </span>
    </span>
  )
}
