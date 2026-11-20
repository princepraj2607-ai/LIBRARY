import { Section } from '../components/ui/Section'
import { EmptyState } from '../components/ui/EmptyState'
import { useSite } from '../context/SiteContext'
import { generalMessage, waLink } from '../lib/whatsapp'

export function Facilities() {
  const { site } = useSite()
  const items = site?.facilities ?? []
  const phone = site?.content.whatsappE164 ?? '919099929095'

  return (
    <Section
      id="facilities"
      dark
      eyebrow="Facilities"
      title="What you will find here"
      intro="Facilities are listed only after they are confirmed by the library. Nothing unverified is shown as a promise."
    >
      {items.length === 0 ? (
        <EmptyState
          dark
          title="Facilities will be published by the library"
          body="We are not listing amenities until they are confirmed. For current facilities, please call or send a WhatsApp enquiry."
          action={{ label: 'Ask on WhatsApp', href: waLink(phone, generalMessage(site?.content.name)) }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/10 bg-navy-2 p-6">
              <p className="text-xs tracking-[0.28em] text-gold uppercase">{item.icon || 'Library'}</p>
              <h3 className="mt-4 font-serif text-3xl">{item.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
