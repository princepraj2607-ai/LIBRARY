import { Seo } from '../components/seo/Seo'
import { Reviews } from '../sections/Reviews'
import { PageShell } from './PageShell'

export function ReviewsPage() {
  return (
    <>
      <Seo
        title="Reviews | VISIONPLUS LIBRARY Patan"
        description="VISIONPLUS LIBRARY has a 5.0 Google rating from 38 reviews. Read verified review highlights from the listing."
        path="/reviews"
      />
      <PageShell eyebrow="Reviews" title="5.0 from students who study here">
        <Reviews />
      </PageShell>
    </>
  )
}
