import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function ContactAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>
  const c = data.content
  const update = (partial: Partial<typeof c>) => setData({ ...data, content: { ...c, ...partial } })

  return (
    <div className="max-w-3xl space-y-3">
      <h1 className="font-serif text-4xl">Contact information</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <input value={c.phoneDisplay} onChange={(e) => update({ phoneDisplay: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
      <input value={c.phoneE164} onChange={(e) => update({ phoneE164: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="Phone digits for tel: links" />
      <input value={c.whatsappE164} onChange={(e) => update({ whatsappE164: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="WhatsApp digits" />
      <input value={c.email} onChange={(e) => update({ email: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="Email (optional)" />
      <textarea value={c.addressLines.join('\n')} onChange={(e) => update({ addressLines: e.target.value.split('\n') })} className="w-full rounded-xl border px-4 py-3" rows={4} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input value={c.city} onChange={(e) => update({ city: e.target.value })} className="rounded-xl border px-4 py-3" />
        <input value={c.state} onChange={(e) => update({ state: e.target.value })} className="rounded-xl border px-4 py-3" />
        <input value={c.postalCode} onChange={(e) => update({ postalCode: e.target.value })} className="rounded-xl border px-4 py-3" />
        <input value={c.plusCode} onChange={(e) => update({ plusCode: e.target.value })} className="rounded-xl border px-4 py-3" />
      </div>
      <input value={c.mapsQuery} onChange={(e) => update({ mapsQuery: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
      <input value={c.mapsReviewsUrl} onChange={(e) => update({ mapsReviewsUrl: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="Google reviews URL" />
      <h2 className="pt-4 font-serif text-2xl">Social links</h2>
      <p className="text-sm text-navy/60">Leave empty platforms unpublished. Links appear in the footer only when a URL is set.</p>
      {c.socials.map((item, index) => (
        <div key={item.id} className="grid gap-2 sm:grid-cols-2">
          <input value={item.platform} onChange={(e) => {
            const socials = c.socials.map((s, i) => i === index ? { ...s, platform: e.target.value } : s)
            update({ socials })
          }} className="rounded-xl border px-4 py-3" placeholder="Platform" />
          <input value={item.url} onChange={(e) => {
            const socials = c.socials.map((s, i) => i === index ? { ...s, url: e.target.value } : s)
            update({ socials })
          }} className="rounded-xl border px-4 py-3" placeholder="URL" />
        </div>
      ))}
      <Button type="button" variant="ghost" className="!text-navy" onClick={() => update({ socials: [...c.socials, { id: crypto.randomUUID(), platform: '', url: '' }] })}>
        Add social link
      </Button>
      <div>
        <Button disabled={saving} onClick={async () => {
          await save('/api/admin/content', c)
          await save('/api/admin/socials', c.socials)
        }}>Save contact</Button>
      </div>
    </div>
  )
}
