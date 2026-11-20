import { Seo } from '../components/seo/Seo'
import { Facilities } from '../sections/Facilities'
import { PageShell } from './PageShell'

export function FacilitiesPage() {
  return (
    <>
      <Seo
        title="Facilities | VISIONPLUS LIBRARY Patan"
        description="Confirmed facilities at VISIONPLUS LIBRARY, Patan. Unverified amenities are never listed as facts."
        path="/facilities"
      />
      <PageShell eyebrow="Facilities" title="Confirmed, not assumed">
        <Facilities />
      </PageShell>
    </>
  )
}
