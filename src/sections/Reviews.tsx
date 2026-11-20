import { Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Section } from '../components/ui/Section'
import { useSite } from '../context/SiteContext'

export function Reviews() {
  const { site } = useSite()
  const content = site?.content
  const reviews = site?.reviews ?? []

  return (
    <Section
      id="reviews"
      eyebrow="Google reviews"
      title="Trusted by students in Patan"
      intro="These lines are review highlights from the business listing. We do not invent named customer reviews."
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-serif text-6xl">{content?.googleRating}/5.0</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-navy/70">
            <Star className="fill-gold text-gold" size={16} />
            {content?.googleReviewCount} Google Reviews
          </p>
        </div>
        <Button href={content?.mapsReviewsUrl} variant="navy">View Google Maps reviews</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <blockquote key={review.id} className="rounded-3xl border border-navy/10 bg-white p-6">
            <p className="font-serif text-2xl leading-snug text-navy">“{review.quote}”</p>
            <p className="mt-4 text-xs tracking-[0.22em] text-gold uppercase">Google review highlight</p>
          </blockquote>
        ))}
      </div>
    </Section>
  )
}
