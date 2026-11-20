import { JsonLd } from '../components/seo/JsonLd'
import { Seo } from '../components/seo/Seo'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Facilities } from '../sections/Facilities'
import { Gallery } from '../sections/Gallery'
import { Hero } from '../sections/Hero'
import { Membership } from '../sections/Membership'
import { Reviews } from '../sections/Reviews'

export function Home() {
  return (
    <>
      <Seo
        title="VISIONPLUS LIBRARY | Study Library in Patan, Gujarat"
        description="VISIONPLUS LIBRARY is a peaceful study and reading library in Patan, Gujarat. 5.0 Google rating from 38 reviews. Book a seat or enquire about membership."
        path="/"
      />
      <JsonLd />
      <Hero />
      <About />
      <Facilities />
      <Membership />
      <Gallery />
      <Reviews />
      <Contact />
    </>
  )
}
