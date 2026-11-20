import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function PlansAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">Membership plans</h1>
      <p className="mt-2 text-sm text-navy/60">Leave price blank to show “On enquiry”. Do not publish invented fees.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 space-y-4">
        {data.plans.map((plan, index) => (
          <div key={plan.id} className="space-y-2 rounded-2xl bg-white p-4">
            <input value={plan.name} placeholder="Plan name" onChange={(e) => {
              const plans = data.plans.map((p, i) => i === index ? { ...p, name: e.target.value } : p)
              setData({ ...data, plans })
            }} className="w-full rounded-lg border px-3 py-2" />
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={plan.duration} placeholder="Duration" onChange={(e) => {
                const plans = data.plans.map((p, i) => i === index ? { ...p, duration: e.target.value } : p)
                setData({ ...data, plans })
              }} className="rounded-lg border px-3 py-2" />
              <input value={plan.price} placeholder="Price" onChange={(e) => {
                const plans = data.plans.map((p, i) => i === index ? { ...p, price: e.target.value } : p)
                setData({ ...data, plans })
              }} className="rounded-lg border px-3 py-2" />
            </div>
            <textarea value={plan.benefits.join('\n')} placeholder="Benefits, one per line" onChange={(e) => {
              const plans = data.plans.map((p, i) => i === index ? { ...p, benefits: e.target.value.split('\n') } : p)
              setData({ ...data, plans })
            }} className="w-full rounded-lg border px-3 py-2" rows={4} />
            <div className="flex justify-between text-sm">
              <label><input type="checkbox" checked={plan.published} onChange={(e) => {
                const plans = data.plans.map((p, i) => i === index ? { ...p, published: e.target.checked } : p)
                setData({ ...data, plans })
              }} /> Published</label>
              <button className="text-red-700" onClick={() => setData({ ...data, plans: data.plans.filter((p) => p.id !== plan.id) })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Button type="button" variant="navy" onClick={() => setData({
          ...data,
          plans: [...data.plans, { id: crypto.randomUUID(), name: '', duration: '', price: '', benefits: [], published: false }],
        })}>Add plan</Button>
        <Button disabled={saving} onClick={() => void save('/api/admin/plans', data.plans)}>Save</Button>
      </div>
    </div>
  )
}
