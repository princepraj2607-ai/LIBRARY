import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import { SiteProvider } from './context/SiteContext'
import { AboutPage } from './pages/AboutPage'
import { BookSeat } from './pages/BookSeat'
import { ContactPage } from './pages/ContactPage'
import { FacilitiesPage } from './pages/FacilitiesPage'
import { GalleryPage } from './pages/GalleryPage'
import { Home } from './pages/Home'
import { MembershipPage } from './pages/MembershipPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { BookingsAdmin } from './pages/admin/BookingsAdmin'
import { ContactAdmin } from './pages/admin/ContactAdmin'
import { ContentAdmin } from './pages/admin/ContentAdmin'
import { Dashboard } from './pages/admin/Dashboard'
import { EnquiriesAdmin } from './pages/admin/EnquiriesAdmin'
import { FacilitiesAdmin } from './pages/admin/FacilitiesAdmin'
import { GalleryAdmin } from './pages/admin/GalleryAdmin'
import { HoursAdmin } from './pages/admin/HoursAdmin'
import { AdminLogin } from './pages/admin/Login'
import { PlansAdmin } from './pages/admin/PlansAdmin'
import { ReviewsAdmin } from './pages/admin/ReviewsAdmin'
import { SeatsAdmin } from './pages/admin/SeatsAdmin'
import { StudentsAdmin } from './pages/admin/StudentsAdmin'

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookSeat />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentAdmin />} />
            <Route path="hours" element={<HoursAdmin />} />
            <Route path="contact" element={<ContactAdmin />} />
            <Route path="facilities" element={<FacilitiesAdmin />} />
            <Route path="plans" element={<PlansAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="reviews" element={<ReviewsAdmin />} />
            <Route path="seats" element={<SeatsAdmin />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="students" element={<StudentsAdmin />} />
            <Route path="enquiries" element={<EnquiriesAdmin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteProvider>
    </AuthProvider>
  )
}
