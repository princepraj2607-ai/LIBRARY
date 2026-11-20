import { api } from '../../lib/api'
import { useAdminData } from './useAdminData'

export function StudentsAdmin() {
  const { data, load, save, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div>
      <h1 className="font-serif text-4xl">Students</h1>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 space-y-3">
        {data.students.map((student) => (
          <div key={student.id} className="grid gap-2 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_1fr_auto]">
            <input defaultValue={student.name} onBlur={(e) => void save(`/api/admin/students/${student.id}`, { name: e.target.value })} className="rounded-lg border px-3 py-2" />
            <input defaultValue={student.phone} onBlur={(e) => void save(`/api/admin/students/${student.id}`, { phone: e.target.value })} className="rounded-lg border px-3 py-2" />
            <button className="text-sm text-red-700" onClick={() => void api(`/api/admin/students/${student.id}`, { method: 'DELETE' }).then(load)}>Delete</button>
          </div>
        ))}
      </div>
      {data.students.length === 0 && <p className="mt-6 text-sm text-navy/50">Students appear automatically from booking requests.</p>}
    </div>
  )
}
