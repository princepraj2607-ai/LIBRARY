import { motion } from 'framer-motion'
import { Section } from '../components/ui/Section'
import { useSite } from '../context/SiteContext'

export function About() {
  const { site } = useSite()
  const content = site?.content

  return (
    <Section
      id="about"
      eyebrow="About us"
      title={content?.aboutTitle}
      intro={content?.aboutBody}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-3xl"
        >
          <img
            src={content?.aboutImage || '/about-study.jpg'}
            alt="Brand atmosphere photograph representing a focused study desk"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="space-y-4">
          {(content?.aboutHighlights ?? []).map((item) => (
            <div key={item} className="rounded-2xl border border-navy/10 bg-white px-5 py-5 shadow-sm">
              <p className="font-serif text-2xl text-navy">{item}</p>
            </div>
          ))}
          <p className="text-sm text-navy/55">
            Interior photographs shown here are brand atmosphere imagery. Gallery photographs of this library appear only after they are uploaded by the administrator.
          </p>
        </div>
      </div>
    </Section>
  )
}
