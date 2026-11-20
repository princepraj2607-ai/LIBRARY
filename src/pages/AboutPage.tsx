import { Seo } from '../components/seo/Seo'
import { About } from '../sections/About'
import { PageShell } from './PageShell'

export function AboutPage() {
  return (
    <>
      <Seo
        title="About VISIONPLUS LIBRARY | Patan Study Space"
        description="Learn about VISIONPLUS LIBRARY, a peaceful study and reading library near Padmanabh Road Chowkdi, Patan, Gujarat."
        path="/about"
      />
      <PageShell eyebrow="About" title="A library built for focus">
        <About />
      </PageShell>
    </>
  )
}
