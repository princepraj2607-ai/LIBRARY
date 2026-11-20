import { Seo } from '../components/seo/Seo'
import { Gallery } from '../sections/Gallery'
import { PageShell } from './PageShell'

export function GalleryPage() {
  return (
    <>
      <Seo
        title="Gallery | VISIONPLUS LIBRARY Patan"
        description="Photographs of VISIONPLUS LIBRARY in Patan, uploaded by the library."
        path="/gallery"
      />
      <PageShell eyebrow="Gallery" title="The space, as it is">
        <Gallery />
      </PageShell>
    </>
  )
}
