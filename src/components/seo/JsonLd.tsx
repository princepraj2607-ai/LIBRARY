import { Helmet } from 'react-helmet-async'
import { useSite } from '../../context/SiteContext'
import { mapsSearchUrl } from '../../lib/maps'

export function JsonLd() {
  const { site } = useSite()
  if (!site) return null
  const { content, hours } = site
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
  const publishedHours = hours.filter((day) => day.open && day.close && !day.closed)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Library',
    name: content.name,
    description: content.heroSubheading,
    telephone: `+${content.phoneE164}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.addressLines.join(', '),
      addressLocality: content.city,
      addressRegion: content.state,
      postalCode: content.postalCode,
      addressCountry: 'IN',
    },
    url: baseUrl.href,
    image: new URL(content.heroImage.replace(/^\//, ''), baseUrl).href,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: content.googleRating,
      reviewCount: content.googleReviewCount,
      bestRating: '5',
    },
    hasMap: mapsSearchUrl(content.mapsQuery),
    openingHoursSpecification: publishedHours.map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: day.day,
      opens: day.open,
      closes: day.close,
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
