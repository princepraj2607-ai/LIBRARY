import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/seo/Seo'
import { Button } from '../components/ui/Button'
import { useSite } from '../context/SiteContext'
import { api } from '../lib/api'
import type { Seat } from '../lib/types'
import { bookingMessage, waLink } from '../lib/whatsapp'
import { PageShell } from './PageShell'

type Availability = {
  configured: boolean
  rows?: number
  cols?: number
  seats: Seat[]
  occupied: string[]
}

export function BookSeat() {
  const { site } = useSite()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [planId, setPlanId] = useState('')
  const [date, setDate] = useState('')
  const [timeSlotId, setTimeSlotId] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState<{ id: string; date: string; status: string; seatLabels: string }[]>([])

  const configured = site?.layout.configured ?? false
  const timeSlots = site?.timeSlots ?? []

  useEffect(() => {
    if (!date || !configured) return
    const params = new URLSearchParams({ date })
    if (timeSlotId) params.set('timeSlotId', timeSlotId)
    void api<Availability>(`/api/public/availability?${params}`).then((data) => {
      setAvailability(data)
      setSelected((current) => current.filter((id) => !data.occupied.includes(id)))
    }).catch((err) => setError(err instanceof Error ? err.message : 'Could not load seats'))
  }, [date, timeSlotId, configured])

  const grid = useMemo(() => {
    const rows = availability?.rows ?? site?.layout.rows ?? 0
    const cols = availability?.cols ?? site?.layout.cols ?? 0
    const seats = availability?.seats ?? []
    return { rows, cols, seats }
  }, [availability, site])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const result = await api<{ message: string }>('/api/public/bookings', {
        method: 'POST',
        body: JSON.stringify({
          name,
          phone,
          planId: planId || null,
          date,
          timeSlotId: timeSlotId || null,
          seatIds: selected,
          notes,
        }),
      })
      setMessage(result.message)
      setSelected([])
      const lookup = await api<{ bookings: typeof history }>(`/api/public/bookings/lookup?phone=${encodeURIComponent(phone)}`)
      setHistory(lookup.bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    }
  }

  const loadHistory = async () => {
    if (!phone) return
    const lookup = await api<{ bookings: typeof history }>(`/api/public/bookings/lookup?phone=${encodeURIComponent(phone)}`)
    setHistory(lookup.bookings)
  }

  return (
    <>
      <Seo
        title="Book a Seat | VISIONPLUS LIBRARY Patan"
        description="Request a study seat at VISIONPLUS LIBRARY, Patan. Bookings are confirmed after administrator approval."
        path="/book"
      />
      <PageShell eyebrow="Reservations" title="Book a seat">
        <section className="bg-ivory px-5 py-16 text-navy sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-navy/65">
                Submit a request with your details. Confirmation is sent after the library approves the booking. Double booking of the same seat, date and time is blocked automatically.
              </p>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" />
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" />
              <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm">
                <option value="">Membership / booking option (optional until plans are published)</option>
                {(site?.plans ?? []).map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}{plan.price ? ` · ${plan.price}` : ''}</option>
                ))}
              </select>
              <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" />
              {timeSlots.length > 0 && (
                <select required value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)} className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm">
                  <option value="">Select time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>{slot.label}</option>
                  ))}
                </select>
              )}

              {!configured && (
                <div className="rounded-2xl border border-dashed border-gold/40 bg-ivory p-5 text-sm">
                  Seat layout has not been configured by the library yet, so live seat selection is unavailable. Please enquire and the team will confirm a seat for you.
                  <div className="mt-4">
                    <Button href={waLink(site?.content.whatsappE164 ?? '919099929095', bookingMessage(site?.content.name))} type="button">
                      Seat booking enquiry
                    </Button>
                  </div>
                </div>
              )}

              {configured && date && grid.rows > 0 && (
                <div>
                  <p className="mb-3 text-sm font-medium">Select an available seat</p>
                  <div
                    className="grid gap-2"
                    style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
                  >
                    {grid.seats
                      .slice()
                      .sort((a, b) => a.row - b.row || a.col - b.col)
                      .map((seat) => {
                        if (seat.kind !== 'seat') {
                          return <div key={seat.id} />
                        }
                        const taken = Boolean(seat.occupied)
                        const on = selected.includes(seat.id)
                        return (
                          <button
                            type="button"
                            key={seat.id}
                            disabled={taken || !seat.active}
                            onClick={() => setSelected(on ? [] : [seat.id])}
                            className={`rounded-lg px-2 py-3 text-xs ${taken ? 'bg-navy/15 text-navy/35' : on ? 'bg-gold text-navy' : 'bg-navy text-ivory hover:bg-navy-2'}`}
                          >
                            {seat.label}
                          </button>
                        )
                      })}
                  </div>
                  <p className="mt-2 text-xs text-navy/50">Gold = selected · Navy = available · Grey = occupied or held</p>
                </div>
              )}

              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes for the library (optional)" className="w-full rounded-xl border border-navy/10 px-4 py-3 text-sm" />
              {error && <p className="text-sm text-red-700">{error}</p>}
              {message && <p className="text-sm text-emerald-800">{message}</p>}
              <Button type="submit" disabled={!configured}>Submit booking request</Button>
            </form>

            <aside className="space-y-5">
              <div className="rounded-3xl bg-navy p-6 text-ivory">
                <p className="text-xs tracking-[0.28em] text-gold uppercase">Need help?</p>
                <p className="mt-3 font-serif text-3xl">Call or WhatsApp</p>
                <p className="mt-3 text-sm text-mist">+91 90999 29095</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={`tel:+919099929095`}>Call</Button>
                  <Button href={waLink(site?.content.whatsappE164 ?? '919099929095', bookingMessage(site?.content.name))} variant="ghost">WhatsApp</Button>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6">
                <p className="font-serif text-2xl">Your booking history</p>
                <p className="mt-2 text-sm text-navy/60">Enter the same mobile number and load previous requests.</p>
                <Button type="button" variant="navy" className="mt-4" onClick={() => void loadHistory()}>Load history</Button>
                <ul className="mt-4 space-y-3 text-sm">
                  {history.map((item) => (
                    <li key={item.id} className="rounded-xl border border-navy/10 px-3 py-3">
                      <span className="font-medium">{item.date}</span> · {item.status}
                      <div className="text-navy/60">{item.seatLabels}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/contact" className="block text-sm text-navy/60 hover:text-gold">Prefer a general enquiry? Contact us</Link>
            </aside>
          </div>
        </section>
      </PageShell>
    </>
  )
}
