
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#16161D] md:flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="ml-4 mt-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E8F0] bg-white text-[#6B6B80] transition hover:bg-[#F0EBFF] hover:text-[#6845E8]"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <span className="ml-3 mt-4 text-base font-semibold tracking-tight">
            finora<span className="text-[#7C5CFC]">.</span>
          </span>
        </div>

        <Topbar />

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-[#16161D]/25"
          />

          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E8F0] px-4 py-3">
              <span className="text-base font-semibold">
                finora<span className="text-[#7C5CFC]">.</span>
              </span>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B6B80] hover:bg-[#F7F7FB]"
              >
                <X size={19} />
              </button>
            </div>

            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}
