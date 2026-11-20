import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { WhatsAppFloat } from './WhatsAppFloat'

export function Layout() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
