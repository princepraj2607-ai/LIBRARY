import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Section } from '../components/ui/Section'
import { useSite } from '../context/SiteContext'
import { membershipMessage, waLink } from '../lib/whatsapp'

export function Membership() {
  const { site } = useSite()
  const plans = site?.plans ?? []
  const phone = site?.content.whatsappE164 ?? '919099929095'
  const name = site?.content.name ?? 'VISIONPLUS LIBRARY'

  return (
    <Section
      id="membership"
      eyebrow="Membership"
      title="Plans shaped around your study rhythm"
      intro="Plan names and prices are published by the administrator. Until then, send an enquiry and the library will share current options."
    >
      {plans.length === 0 ? (
        <EmptyState
          title="Membership prices are not listed yet"
          body="We do not invent fees. Ask for current membership options and the team will respond with verified details."
          action={{ label: 'Membership enquiry on WhatsApp', href: waLink(phone, membershipMessage(name)) }}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="flex flex-col rounded-3xl border border-navy/10 bg-white p-7 shadow-sm">
              <p className="text-xs tracking-[0.28em] text-gold uppercase">{plan.duration}</p>
              <h3 className="mt-3 font-serif text-3xl">{plan.name}</h3>
              <p className="mt-4 font-serif text-4xl text-navy">{plan.price || 'On enquiry'}</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-navy/70">
                {plan.benefits.filter(Boolean).map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={waLink(phone, `Hello ${name}, I would like to enquire about the ${plan.name} membership.`)}>
                  Enquire
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
