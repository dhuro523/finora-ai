
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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#E8E8F0] bg-white px-5 py-6">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC]">
          <Activity size={22} strokeWidth={2.2} className="text-white" />
        </div>

        <div>
          <p className="text-lg font-semibold tracking-tight text-[#16161D]">
            finora<span className="text-[#7C5CFC]">.</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#85859A]">
            Personal finance AI
          </p>
        </div>
      </div>

      {/* Navigation */}
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9292A5]">
        Workspace
      </p>

      <nav className="flex flex-col gap-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'border-[#E8E0FF] bg-[#F0EBFF] text-[#6845E8]'
                  : 'border-transparent text-[#6B6B80] hover:bg-[#F7F7FB] hover:text-[#16161D]'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>

            {label === 'AI Copilot' && (
              <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#7C5CFC] ring-1 ring-[#E8E0FF]">
                AI
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        <div className="mb-5 rounded-xl border border-[#E8E8F0] bg-[#FAFAFD] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Wallet size={16} className="text-[#7C5CFC]" />
            <span className="text-xs font-semibold text-[#292936]">
              Your money. Understood.
            </span>
          </div>

          <p className="text-xs leading-5 text-[#77778B]">
            Turn your financial data into clearer decisions.
          </p>
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
              isActive
                ? 'bg-[#F0EBFF] font-medium text-[#6845E8]'
                : 'text-[#6B6B80] hover:bg-[#F7F7FB] hover:text-[#16161D]'
            }`
          }
        >
          <Settings2 size={18} strokeWidth={1.9} />
          Settings
        </NavLink>

        {/* Demo profile */}
        <div className="mt-5 border-t border-[#E8E8F0] pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EBFF] text-xs font-semibold text-[#6845E8]">
              FA
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#292936]">
                Finora Demo
              </p>
              <p className="mt-0.5 text-[10px] text-[#85859A]">
                Sample financial data
              </p>
            </div>

            <span
              className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#16A34A]"
              title="Demo mode"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
