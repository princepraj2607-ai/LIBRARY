import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useSite } from '../context/SiteContext'

export function Hero() {
  const { site } = useSite()
  const content = site?.content

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden grain">
      <img
        src={content?.heroImage || `${import.meta.env.BASE_URL}hero-library.jpg`}
        alt="Quiet study interior atmosphere used as brand imagery until library photographs are uploaded"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-20 pt-32 sm:px-8 lg:justify-center lg:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-xs tracking-[0.35em] text-gold uppercase">Patan, Gujarat</p>
          <h1 className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
            {content?.heroHeadline ?? 'Your Space. Your Focus. Your Success.'}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
            {content?.heroSubheading}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/about">Explore Our Library</Button>
            <Button to="/contact" variant="ghost">Contact Us</Button>
          </div>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-navy/50 px-4 py-2 text-sm text-ivory backdrop-blur">
            <Star className="fill-gold text-gold" size={16} />
            <span className="font-medium">{content?.googleRating ?? '5.0'} ★</span>
            <span className="text-mist">|</span>
            <span>{content?.googleReviewCount ?? 38} Google Reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
