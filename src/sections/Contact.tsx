import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { useSite } from '../context/SiteContext'
import { api } from '../lib/api'
import { mapsDirectionsUrl, mapsEmbedUrl, telLink } from '../lib/maps'
import { generalMessage, waLink } from '../lib/whatsapp'

export function Contact() {
  const { site } = useSite()
  const content = site?.content
  const hours = site?.hours ?? []
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('')
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await api('/api/public/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          phone: form.get('phone'),
          email: form.get('email'),
          type: form.get('type'),
          message: form.get('message'),
        }),
      })
      setStatus('Enquiry received. The library will get back to you.')
      event.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send enquiry')
    }
  }

  const query = content?.mapsQuery ?? 'VISIONPLUS LIBRARY Patan'
  const configuredHours = hours.filter((day) => day.open || day.close || day.closed || day.note)

  return (
    <Section
      id="contact"
      dark
      eyebrow="Visit"
      title="Location & contact"
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-mist">
            {content?.addressLines.join(', ')}
            <br />
            {content?.city}, {content?.state} {content?.postalCode}, {content?.country}
          </p>
          <p className="mt-4 text-sm text-gold">Plus Code: {content?.plusCode}</p>
          <p className="mt-6">
            <a className="text-2xl font-serif text-ivory hover:text-gold" href={telLink(content?.phoneE164 ?? '919099929095')}>
              {content?.phoneDisplay}
            </a>
          </p>
          <p className="mt-6 max-w-md text-sm text-mist">{content?.hoursNotice}</p>
          {configuredHours.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-ivory/80">
              {hours.map((day) => (
                <li key={day.day} className="flex justify-between gap-4 border-b border-white/5 py-2">
                  <span>{day.day}</span>
                  <span>
                    {day.closed ? 'Closed' : day.open && day.close ? `${day.open} – ${day.close}` : day.note || 'To be confirmed'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={mapsDirectionsUrl(query)}>Get Directions</Button>
            <Button href={waLink(content?.whatsappE164 ?? '919099929095', generalMessage(content?.name))} variant="ghost">
              WhatsApp enquiry
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <iframe
              title="VISIONPLUS LIBRARY on Google Maps"
              src={mapsEmbedUrl(query)}
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <form onSubmit={onSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-navy-2 p-5">
            <p className="font-serif text-2xl">Send an enquiry</p>
            <input required name="name" placeholder="Your name" className="w-full rounded-xl bg-navy px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold" />
            <input required name="phone" placeholder="Mobile number" className="w-full rounded-xl bg-navy px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold" />
            <input name="email" type="email" placeholder="Email (optional)" className="w-full rounded-xl bg-navy px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold" />
            <select name="type" className="w-full rounded-xl bg-navy px-4 py-3 text-sm outline-none ring-1 ring-white/10">
              <option value="general">General enquiry</option>
              <option value="membership">Membership enquiry</option>
              <option value="booking">Seat booking enquiry</option>
            </select>
            <textarea required name="message" rows={4} placeholder="How can we help?" className="w-full rounded-xl bg-navy px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-gold" />
            {error && <p className="text-sm text-red-300">{error}</p>}
            {status && <p className="text-sm text-gold-2">{status}</p>}
            <Button type="submit">Submit enquiry</Button>
          </form>
        </div>
      </div>
    </Section>
  )
}
