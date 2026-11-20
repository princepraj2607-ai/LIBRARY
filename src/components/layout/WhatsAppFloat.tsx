import { MessageCircle } from 'lucide-react'
import { useSite } from '../../context/SiteContext'
import { generalMessage, waLink } from '../../lib/whatsapp'

export function WhatsAppFloat() {
  const { site } = useSite()
  const phone = site?.content.whatsappE164 ?? '919099929095'
  const name = site?.content.name ?? 'VISIONPLUS LIBRARY'

  return (
    <a
      href={waLink(phone, generalMessage(name))}
      className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition hover:scale-105"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp enquiry"
    >
      <MessageCircle size={26} />
    </a>
  )
}
