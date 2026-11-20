import { EmptyState } from '../components/ui/EmptyState'
import { Section } from '../components/ui/Section'
import { useSite } from '../context/SiteContext'

export function Gallery() {
  const { site } = useSite()
  const images = site?.gallery ?? []

  return (
    <Section
      id="gallery"
      dark
      eyebrow="Gallery"
      title="Inside the library"
      intro="Only photographs uploaded by VISIONPLUS LIBRARY are shown here. Unrelated stock images are never presented as the actual space."
    >
      {images.length === 0 ? (
        <EmptyState
          dark
          title="Library photographs coming soon"
          body="When the owner uploads photographs through the admin dashboard, they will appear in this gallery."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <figure key={image.id} className="overflow-hidden rounded-3xl bg-navy-2">
              <img src={image.url} alt={image.caption || 'VISIONPLUS LIBRARY photograph'} className="h-64 w-full object-cover" />
              {image.caption && <figcaption className="px-4 py-3 text-sm text-mist">{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </Section>
  )
}
