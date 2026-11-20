import { Button } from '../../components/ui/Button'
import type { BookingStatus } from '../../lib/types'
import { useAdminData } from './useAdminData'

const statuses: BookingStatus[] = ['Pending', 'Approved', 'Rejected', 'Cancelled']

export function BookingsAdmin() {
  const { data, save, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div>
      <h1 className="font-serif text-4xl">Bookings</h1>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b text-xs tracking-wide text-navy/50 uppercase">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Date</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Status</th>
              <th className="p-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {data.bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-navy/5">
                <td className="p-3">
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-navy/50">{booking.phone}</div>
                </td>
                <td className="p-3">
                  {booking.date}
                  <div className="text-navy/50">{data.timeSlots.find((s) => s.id === booking.timeSlotId)?.label}</div>
                </td>
                <td className="p-3">{booking.seatIds.map((id) => data.seats.find((s) => s.id === id)?.label ?? id).join(', ')}</td>
                <td className="p-3">
                  <select
                    value={booking.status}
                    onChange={(e) => void save(`/api/admin/bookings/${booking.id}`, { status: e.target.value })}
                    className="rounded-lg border px-2 py-1"
                  >
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    defaultValue={booking.adminNote}
                    onBlur={(e) => void save(`/api/admin/bookings/${booking.id}`, { adminNote: e.target.value })}
                    className="w-full rounded-lg border px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.bookings.length === 0 && <p className="mt-6 text-sm text-navy/50">No booking requests yet.</p>}
      <Button to="/" variant="ghost" className="mt-6 !text-navy">View public site</Button>
    </div>
  )
}
