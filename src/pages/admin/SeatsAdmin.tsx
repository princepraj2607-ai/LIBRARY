import { Button } from '../../components/ui/Button'
import type { Seat } from '../../lib/types'
import { useAdminData } from './useAdminData'

function buildGrid(rows: number, cols: number, existing: Seat[]): Seat[] {
  const map = new Map(existing.map((seat) => [`${seat.row}-${seat.col}`, seat]))
  const next: Seat[] = []
  for (let row = 1; row <= rows; row += 1) {
    for (let col = 1; col <= cols; col += 1) {
      const found = map.get(`${row}-${col}`)
      next.push(
        found ?? {
          id: crypto.randomUUID(),
          label: `R${row}C${col}`,
          row,
          col,
          kind: 'seat',
          active: true,
        },
      )
    }
  }
  return next
}

export function SeatsAdmin() {
  const { data, setData, save, saving, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  const generate = () => {
    setData({
      ...data,
      seats: buildGrid(data.gridRows, data.gridCols, data.seats),
    })
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Seat layout</h1>
      <p className="mt-2 max-w-2xl text-sm text-navy/60">
        Set the real grid used on the floor. Empty cells are aisles. Capacity should match actual seats, not a guess.
      </p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
        <label className="text-sm">Rows
          <input type="number" min={0} value={data.gridRows} onChange={(e) => setData({ ...data, gridRows: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm">Columns
          <input type="number" min={0} value={data.gridCols} onChange={(e) => setData({ ...data, gridCols: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
        <label className="text-sm">Capacity
          <input type="number" min={0} value={data.capacity} onChange={(e) => setData({ ...data, capacity: Number(e.target.value) })} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </label>
      </div>
      <Button type="button" className="mt-4" variant="navy" onClick={generate}>Generate / refresh grid</Button>

      {data.gridRows > 0 && data.gridCols > 0 && (
        <div className="mt-8 overflow-auto rounded-2xl bg-white p-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data.gridCols}, minmax(72px, 1fr))` }}>
            {data.seats.map((seat) => (
              <button
                type="button"
                key={seat.id}
                onClick={() => {
                  const seats = data.seats.map((item) => {
                    if (item.id !== seat.id) return item
                    const kind = item.kind === 'seat' ? 'empty' as const : 'seat' as const
                    return { ...item, kind, active: kind === 'seat' }
                  })
                  setData({ ...data, seats })
                }}
                className={`rounded-lg px-2 py-3 text-xs ${seat.kind === 'seat' ? 'bg-navy text-ivory' : 'bg-navy/10 text-navy/40'}`}
              >
                {seat.kind === 'seat' ? seat.label : 'Aisle'}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {data.seats.filter((s) => s.kind === 'seat').map((seat) => (
              <input
                key={seat.id}
                value={seat.label}
                onChange={(e) => setData({
                  ...data,
                  seats: data.seats.map((item) => item.id === seat.id ? { ...item, label: e.target.value } : item),
                })}
                className="rounded-lg border px-3 py-2 text-sm"
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="mt-10 font-serif text-2xl">Time options</h2>
      <p className="text-sm text-navy/60">Optional. If none are active, students book by date only.</p>
      <div className="mt-3 space-y-2">
        {data.timeSlots.map((slot, index) => (
          <div key={slot.id} className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-4">
            <input value={slot.label} onChange={(e) => {
              const timeSlots = data.timeSlots.map((item, i) => i === index ? { ...item, label: e.target.value } : item)
              setData({ ...data, timeSlots })
            }} className="rounded border px-3 py-2 text-sm" placeholder="Label" />
            <input value={slot.start} onChange={(e) => {
              const timeSlots = data.timeSlots.map((item, i) => i === index ? { ...item, start: e.target.value } : item)
              setData({ ...data, timeSlots })
            }} className="rounded border px-3 py-2 text-sm" placeholder="Start" />
            <input value={slot.end} onChange={(e) => {
              const timeSlots = data.timeSlots.map((item, i) => i === index ? { ...item, end: e.target.value } : item)
              setData({ ...data, timeSlots })
            }} className="rounded border px-3 py-2 text-sm" placeholder="End" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={slot.active} onChange={(e) => {
                const timeSlots = data.timeSlots.map((item, i) => i === index ? { ...item, active: e.target.checked } : item)
                setData({ ...data, timeSlots })
              }} />
              Active
            </label>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" className="mt-3 !text-navy" onClick={() => setData({
        ...data,
        timeSlots: [...data.timeSlots, { id: crypto.randomUUID(), label: '', start: '', end: '', active: true }],
      })}>Add time option</Button>
      <div className="mt-6">
        <Button disabled={saving} onClick={() => void save('/api/admin/seats', {
          gridRows: data.gridRows,
          gridCols: data.gridCols,
          capacity: data.capacity,
          seats: data.seats,
          timeSlots: data.timeSlots,
        })}>Save layout</Button>
      </div>
    </div>
  )
}
