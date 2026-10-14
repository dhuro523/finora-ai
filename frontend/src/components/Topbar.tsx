
import { Link } from 'react-router-dom'
import { Bell, ChevronDown, Search, Sparkles } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-[#E8E8F0] bg-white px-4 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="min-w-0">
        <p className="text-xs text-[#85859A]">Welcome back</p>
        <h1 className="mt-1 truncate text-sm font-semibold text-[#16161D]">
          Your financial overview
        </h1>
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Search"
          className="hidden items-center gap-2 rounded-xl border border-[#E8E8F0] bg-[#FAFAFD] px-3 py-2.5 text-xs text-[#85859A] transition hover:border-[#D6CCFF] hover:bg-white sm:flex"
        >
          <Search size={15} />
          <span>Search anything...</span>
          <span className="ml-3 rounded border border-[#E8E8F0] bg-white px-1.5 py-0.5 text-[10px] text-[#85859A]">
            /
          </span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E8F0] text-[#6B6B80] transition hover:bg-[#F7F7FB] hover:text-[#16161D]"
        >
          <Bell size={17} strokeWidth={1.8} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-[#F7F7FB] sm:px-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0EBFF] text-xs font-semibold text-[#6845E8]">
            FA
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-[#292936]">Finora Demo</p>
            <p className="mt-0.5 text-[10px] text-[#85859A]">Free plan</p>
          </div>

          <ChevronDown size={14} className="hidden text-[#85859A] sm:block" />
        </button>

        <Link
          to="/copilot"
          className="flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#6845E8] sm:px-4"
        >
          <Sparkles size={15} />
          <span className="hidden sm:inline">Ask AI</span>
          <span className="sm:hidden">AI</span>
        </Link>
      </div>
    </header>
  )
}
