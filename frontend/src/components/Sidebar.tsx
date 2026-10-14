import { NavLink } from 'react-router-dom'
import {
  Activity,
  ArrowLeftRight,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings2,
  Sparkles,
  Wallet,
} from 'lucide-react'

const navigation = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
  { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { label: 'AI Copilot', path: '/copilot', icon: Sparkles },
]

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0D0E1C] px-5 py-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B73FF] to-[#6241E8] shadow-lg shadow-violet-900/30">
          <Activity size={22} strokeWidth={2.4} className="text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">finora<span className="text-violet-400">.</span></p>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">Personal finance AI</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Workspace
      </p>

      <nav className="flex flex-col gap-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border border-violet-400/20 bg-violet-500/10 text-violet-300'
                  : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {label === 'AI Copilot' && (
              <span className="ml-auto rounded-md bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
                AI
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wallet size={16} className="text-violet-300" />
            <span className="text-xs font-medium text-slate-200">Your money. Understood.</span>
          </div>
          <p className="text-xs leading-5 text-slate-500">
            Turn your financial data into clearer decisions.
          </p>
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
              isActive ? 'text-violet-300' : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
            }`
          }
        >
          <Settings2 size={18} strokeWidth={1.8} />
          Settings
        </NavLink>

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-xs font-semibold text-violet-200">
              FA
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">Finora Demo</p>
              <p className="mt-0.5 text-[10px] text-slate-500">Sample financial data</p>
            </div>
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    </aside>
  )
}