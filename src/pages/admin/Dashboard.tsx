import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import type { DashboardStats } from '../../lib/types'

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    void api<DashboardStats>('/api/admin/dashboard').then(setStats)
  }, [])

  const cards = [
    { label: 'Pending bookings', value: stats?.pendingBookings ?? '—', to: '/admin/bookings' },
    { label: 'Approved bookings', value: stats?.approvedBookings ?? '—', to: '/admin/bookings' },
    { label: 'Students', value: stats?.students ?? '—', to: '/admin/students' },
    { label: 'Unread enquiries', value: stats?.unreadEnquiries ?? '—', to: '/admin/enquiries' },
    { label: 'Published plans', value: stats?.publishedPlans ?? '—', to: '/admin/plans' },
    { label: 'Published facilities', value: stats?.publishedFacilities ?? '—', to: '/admin/facilities' },
    { label: 'Gallery photographs', value: stats?.galleryCount ?? '—', to: '/admin/gallery' },
    { label: 'Configured seats', value: stats?.configuredSeats ?? '—', to: '/admin/seats' },
  ]

  return (
    <div>
      <h1 className="font-serif text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-navy/60">Live snapshot of VISIONPLUS LIBRARY operations.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs tracking-[0.22em] text-gold uppercase">{card.label}</p>
            <p className="mt-3 font-serif text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
