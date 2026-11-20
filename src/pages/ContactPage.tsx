import { Seo } from '../components/seo/Seo'
import { Contact } from '../sections/Contact'
import { PageShell } from './PageShell'

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | VISIONPLUS LIBRARY Patan"
        description="Visit VISIONPLUS LIBRARY at Shiv Arcade Complex, Patan-Chanasma Highway Road, Patan, Gujarat. Call +91 90999 29095."
        path="/contact"
      />
      <PageShell eyebrow="Contact" title="Come study with us">
        <Contact />
      </PageShell>
    </>
  )
}
