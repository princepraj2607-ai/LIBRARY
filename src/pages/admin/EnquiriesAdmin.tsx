import { useAdminData } from './useAdminData'

export function EnquiriesAdmin() {
  const { data, save, error } = useAdminData()
  if (!data) return <p>Loading…</p>

  return (
    <div>
      <h1 className="font-serif text-4xl">Enquiries</h1>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-6 space-y-3">
        {data.enquiries.map((item) => (
          <article key={item.id} className={`rounded-2xl p-4 ${item.read ? 'bg-white' : 'bg-gold-2/40'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{item.name} · {item.phone}</p>
              <button className="text-sm text-navy/60" onClick={() => void save(`/api/admin/enquiries/${item.id}`, { read: !item.read })}>
                Mark {item.read ? 'unread' : 'read'}
              </button>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-gold">{item.type}</p>
            <p className="mt-3 text-sm leading-relaxed">{item.message}</p>
            <p className="mt-2 text-xs text-navy/40">{new Date(item.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
      {data.enquiries.length === 0 && <p className="mt-6 text-sm text-navy/50">No enquiries yet.</p>}
    </div>
  )
}
