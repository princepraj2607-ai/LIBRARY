import { Button } from '../../components/ui/Button'
import { useAdminData } from './useAdminData'

export function HoursAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">Opening hours</h1>
      <p className="mt-2 text-sm text-navy/60">Leave times blank until they are confirmed. Do not invent a weekly schedule.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <textarea
        className="mt-6 w-full rounded-xl border px-4 py-3"
        rows={3}
        value={data.content.hoursNotice}
        onChange={(e) => setData({ ...data, content: { ...data.content, hoursNotice: e.target.value } })}
      />
      <div className="mt-6 space-y-3">
        {data.hours.map((day, index) => (
          <div key={day.day} className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 sm:grid-cols-5">
            <p className="col-span-2 font-medium sm:col-span-1">{day.day}</p>
            <input value={day.open} placeholder="Open" onChange={(e) => {
              const hours = data.hours.map((item, i) => i === index ? { ...item, open: e.target.value } : item)
              setData({ ...data, hours })
            }} className="rounded-lg border px-3 py-2 text-sm" />
            <input value={day.close} placeholder="Close" onChange={(e) => {
              const hours = data.hours.map((item, i) => i === index ? { ...item, close: e.target.value } : item)
              setData({ ...data, hours })
            }} className="rounded-lg border px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={day.closed} onChange={(e) => {
                const hours = data.hours.map((item, i) => i === index ? { ...item, closed: e.target.checked } : item)
                setData({ ...data, hours })
              }} />
              Closed
            </label>
            <input value={day.note} placeholder="Note" onChange={(e) => {
              const hours = data.hours.map((item, i) => i === index ? { ...item, note: e.target.value } : item)
              setData({ ...data, hours })
            }} className="col-span-2 rounded-lg border px-3 py-2 text-sm sm:col-span-5" />
          </div>
        ))}
      </div>
      <Button className="mt-6" disabled={saving} onClick={() => void save('/api/admin/hours', { hours: data.hours, hoursNotice: data.content.hoursNotice })}>
        Save hours
      </Button>
    </div>
  )
}
