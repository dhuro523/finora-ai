import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  demoStats,
  demoCashFlow,
  demoSpending,
  demoSavingsGoal,
} from '../data/finance'

const statIcons = [DollarSign, ArrowDownLeft, CreditCard, PiggyBank]

const chartColors = [
  '#8B73FF',
  '#36C8E8',
  '#F6B75E',
  '#F472B6',
  '#34405D',
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

const tooltipStyle = {
  backgroundColor: '#151629',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
}

export default function Overview() {
  const totalSpent = demoSpending.reduce(
    (total, item) => total + item.amount,
    0,
  )

  const savingsPercent = Math.round(
    (demoSavingsGoal.saved / demoSavingsGoal.target) * 100,
  )

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">
            Wednesday, October 14, 2026
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Here's your money, at a glance.
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Understand your spending. Make your next move count.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20">
          <TrendingUp size={16} />
          This month
        </button>
      </section>

      {/* Financial summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demoStats.map((stat, index) => {
          const Icon = statIcons[index]

          return (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/[0.07] bg-[#101120] p-5 transition duration-200 hover:border-violet-400/20"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              </div>

              <p className="mt-5 text-2xl font-semibold tracking-tight text-white">
                {stat.value}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-medium text-emerald-400">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>
                <span className="text-slate-500">{stat.detail}</span>
              </div>
            </article>
          )
        })}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Cash flow chart */}
        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-6 xl:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">Cash flow</h3>
              <p className="mt-1 text-xs text-slate-500">
                Income versus expenses over the last six months
              </p>
            </div>

            <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-400">
              Last 6 months
            </span>
          </div>

          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demoCashFlow}
                barGap={6}
                margin={{ top: 8, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(139,115,255,0.08)' }}
                  contentStyle={tooltipStyle}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#8B73FF"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  name="Expenses"
                  fill="#36C8E8"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex gap-5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-violet-400" />
              Income
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
              Expenses
            </div>
          </div>
        </article>

        {/* Spending breakdown chart */}
        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-6">
          <h3 className="font-semibold text-white">Spending breakdown</h3>
          <p className="mt-1 text-xs text-slate-500">
            Where your money goes
          </p>

          <div className="relative mx-auto my-6 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoSpending}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {demoSpending.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500">Total spent</span>
              <span className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(totalSpent)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {demoSpending.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{
                      backgroundColor:
                        chartColors[index % chartColors.length],
                    }}
                  />
                  <span className="text-slate-300">{item.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="w-8 text-right text-slate-500">
                    {item.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Financial insights and savings goal */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.10] to-[#101120] p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Your savings opportunity
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                A demo insight from Finora
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Your dining expenses are one area to review. A 10% reduction
            could free up around $70 this month, based on this sample data.
          </p>

          <button className="mt-5 text-xs font-semibold text-violet-300 transition hover:text-violet-200">
            Explore spending →
          </button>
        </article>

        <article className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.07] to-[#101120] p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <PiggyBank size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Monthly savings goal
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Your progress at a glance
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">
                {formatCurrency(demoSavingsGoal.saved)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                of {formatCurrency(demoSavingsGoal.target)} goal
              </p>
            </div>
            <p className="text-sm font-semibold text-cyan-300">
              {savingsPercent}%
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-400"
              style={{ width: `${savingsPercent}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            {formatCurrency(demoSavingsGoal.target - demoSavingsGoal.saved)}{' '}
            left to reach your goal.
          </p>
        </article>
      </section>
    </div>
  )
}