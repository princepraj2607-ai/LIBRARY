import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function FacilitiesAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  const add = () => {
    setData({
      ...data,
      facilities: [...data.facilities, { id: crypto.randomUUID(), name: '', description: '', icon: '', published: false }],
    })
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">Facilities</h1>
      <p className="mt-2 text-sm text-navy/60">Unpublished items stay hidden on the website. Only confirm amenities that actually exist.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 space-y-4">
        {data.facilities.map((item, index) => (
          <div key={item.id} className="space-y-2 rounded-2xl bg-white p-4">
            <input value={item.name} placeholder="Name" onChange={(e) => {
              const facilities = data.facilities.map((f, i) => i === index ? { ...f, name: e.target.value } : f)
              setData({ ...data, facilities })
            }} className="w-full rounded-lg border px-3 py-2" />
            <input value={item.icon} placeholder="Short label / icon text" onChange={(e) => {
              const facilities = data.facilities.map((f, i) => i === index ? { ...f, icon: e.target.value } : f)
              setData({ ...data, facilities })
            }} className="w-full rounded-lg border px-3 py-2" />
            <textarea value={item.description} placeholder="Description" onChange={(e) => {
              const facilities = data.facilities.map((f, i) => i === index ? { ...f, description: e.target.value } : f)
              setData({ ...data, facilities })
            }} className="w-full rounded-lg border px-3 py-2" />
            <div className="flex items-center justify-between">
              <label className="text-sm"><input type="checkbox" checked={item.published} onChange={(e) => {
                const facilities = data.facilities.map((f, i) => i === index ? { ...f, published: e.target.checked } : f)
                setData({ ...data, facilities })
              }} /> Published</label>
              <button className="text-sm text-red-700" onClick={() => setData({ ...data, facilities: data.facilities.filter((f) => f.id !== item.id) })}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Button type="button" variant="navy" onClick={add}>Add facility</Button>
        <Button disabled={saving} onClick={() => void save('/api/admin/facilities', data.facilities)}>Save</Button>
      </div>
    </div>
  )
}
