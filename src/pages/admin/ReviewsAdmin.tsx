import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function ReviewsAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">Google reviews</h1>
      <p className="mt-2 text-sm text-navy/60">Keep highlights faithful to the Google listing. Do not invent reviewer names.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input value={data.content.googleRating} onChange={(e) => setData({ ...data, content: { ...data.content, googleRating: e.target.value } })} className="rounded-xl border px-4 py-3" />
        <input type="number" value={data.content.googleReviewCount} onChange={(e) => setData({ ...data, content: { ...data.content, googleReviewCount: Number(e.target.value) } })} className="rounded-xl border px-4 py-3" />
      </div>
      <input value={data.content.mapsReviewsUrl} onChange={(e) => setData({ ...data, content: { ...data.content, mapsReviewsUrl: e.target.value } })} className="mt-3 w-full rounded-xl border px-4 py-3" placeholder="Google Maps reviews URL" />
      <div className="mt-6 space-y-3">
        {data.reviews.map((review, index) => (
          <div key={review.id} className="rounded-2xl bg-white p-4">
            <textarea value={review.quote} onChange={(e) => {
              const reviews = data.reviews.map((item, i) => i === index ? { ...item, quote: e.target.value } : item)
              setData({ ...data, reviews })
            }} className="w-full rounded-lg border px-3 py-2" />
            <div className="mt-2 flex justify-between text-sm">
              <label><input type="checkbox" checked={review.published} onChange={(e) => {
                const reviews = data.reviews.map((item, i) => i === index ? { ...item, published: e.target.checked } : item)
                setData({ ...data, reviews })
              }} /> Published</label>
              <button className="text-red-700" onClick={() => setData({ ...data, reviews: data.reviews.filter((item) => item.id !== review.id) })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Button type="button" variant="navy" onClick={() => setData({
          ...data,
          reviews: [...data.reviews, { id: crypto.randomUUID(), quote: '', published: false }],
        })}>Add highlight</Button>
        <Button disabled={saving} onClick={async () => {
          await save('/api/admin/content', data.content)
          await save('/api/admin/reviews', { reviews: data.reviews, mapsReviewsUrl: data.content.mapsReviewsUrl })
        }}>Save</Button>
      </div>
    </div>
  )
}
