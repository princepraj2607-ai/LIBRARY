type Props = {
  title: string
  body: string
  action?: { label: string; href: string }
  dark?: boolean
}

export function EmptyState({ title, body, action, dark = false }: Props) {
  return (
    <div className={`rounded-2xl border border-dashed px-6 py-12 text-center ${dark ? 'border-gold/30 bg-white/5' : 'border-gold/35 bg-navy/5'}`}>
      <p className="font-serif text-2xl">{title}</p>
      <p className={`mx-auto mt-3 max-w-lg text-sm leading-relaxed ${dark ? 'text-mist' : 'text-navy/65'}`}>{body}</p>
      {action && (
        <a className="mt-6 inline-flex text-sm font-medium tracking-wide text-gold hover:underline" href={action.href}>
          {action.label}
        </a>
      )}
    </div>
  )
}
