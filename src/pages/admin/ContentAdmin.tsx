import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function ContentAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>
  const c = data.content

  const update = (partial: Partial<typeof c>) => {
    setData({ ...data, content: { ...c, ...partial } })
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-serif text-4xl">Website content</h1>
      <p className="text-sm text-navy/60">Edit public copy. Do not add unverified claims.</p>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <input value={c.heroHeadline} onChange={(e) => update({ heroHeadline: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
      <textarea value={c.heroSubheading} onChange={(e) => update({ heroSubheading: e.target.value })} className="w-full rounded-xl border px-4 py-3" rows={3} />
      <input value={c.aboutTitle} onChange={(e) => update({ aboutTitle: e.target.value })} className="w-full rounded-xl border px-4 py-3" />
      <textarea value={c.aboutBody} onChange={(e) => update({ aboutBody: e.target.value })} className="w-full rounded-xl border px-4 py-3" rows={6} />
      <textarea
        value={c.aboutHighlights.join('\n')}
        onChange={(e) => update({ aboutHighlights: e.target.value.split('\n') })}
        className="w-full rounded-xl border px-4 py-3"
        rows={4}
      />
      <p className="text-xs text-navy/50">One highlight per line.</p>
      <input value={c.heroImage} onChange={(e) => update({ heroImage: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="Hero image URL" />
      <input value={c.aboutImage} onChange={(e) => update({ aboutImage: e.target.value })} className="w-full rounded-xl border px-4 py-3" placeholder="About image URL" />
      <Button disabled={saving} onClick={() => void save('/api/admin/content', c)}>Save content</Button>
    </div>
  )
}
