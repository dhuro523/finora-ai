import { Bell, ChevronDown, Search, Sparkles } from 'lucide-react'

export default function Topbar() {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#0A0B18]/80 px-8">
      <div>
        <p className="text-xs text-slate-500">Welcome back</p>
        <h1 className="mt-1 text-sm font-semibold text-white">
          Your financial overview
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-slate-500 transition hover:border-violet-400/30 sm:flex">
          <Search size={15} />
          <span>Search anything...</span>
          <span className="ml-4 rounded border border-white/10 px-1.5 py-0.5 text-[10px]">
            /
          </span>
        </button>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.05] hover:text-white">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-white/[0.04]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-xs font-semibold text-violet-200">
            FA
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-white">Finora Demo</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Free plan</p>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        <button className="hidden items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:bg-violet-400 md:flex">
          <Sparkles size={15} />
          Ask AI
        </button>
      </div>
    </header>
  )
}