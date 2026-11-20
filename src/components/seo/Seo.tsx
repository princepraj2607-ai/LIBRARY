import { Helmet } from 'react-helmet-async'

type Props = {
  title: string
  description: string
  path?: string
}

const origin = typeof window !== 'undefined' ? window.location.origin : 'https://visionpluslibrary.in'
const baseUrl = new URL(import.meta.env.BASE_URL, origin)

export function Seo({ title, description, path = '/' }: Props) {
  const url = new URL(path.replace(/^\//, ''), baseUrl).href
  const imageUrl = new URL('og-cover.jpg', baseUrl).href
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="VISIONPLUS LIBRARY, study library Patan, reading library Gujarat, silent study space Patan, student library Chanasma Highway" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}
