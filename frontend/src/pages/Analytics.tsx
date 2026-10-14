import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Wallet,
} from 'lucide-react'

const monthlyData = [
  { month: 'May', income: 5200, expenses: 3400 },
  { month: 'Jun', income: 5800, expenses: 3600 },
  { month: 'Jul', income: 5500, expenses: 3200 },
  { month: 'Aug', income: 6100, expenses: 3900 },
  { month: 'Sep', income: 5900, expenses: 3500 },
  { month: 'Oct', income: 6420, expenses: 3185 },
]

const categoryData = [
  { category: 'Housing', amount: 1115 },
  { category: 'Food', amount: 700 },
  { category: 'Transport', amount: 541 },
  { category: 'Shopping', amount: 446 },
  { category: 'Other', amount: 383 },
]

const tooltipStyle = {
  backgroundColor: '#151629',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#fff',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function Analytics() {
  const latestMonth = monthlyData[monthlyData.length - 1]
  const savingsRate = Math.round(
    ((latestMonth.income - latestMonth.expenses) / latestMonth.income) * 100,
  )

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Financial intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Analytics
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Understand your patterns. Make smarter financial decisions.
          </p>
        </div>

        <span className="w-fit rounded-xl border border-white/[0.08] bg-[#101120] px-4 py-2.5 text-sm text-slate-300">
          Last 6 months
        </span>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Monthly income</p>
            <Wallet size={18} className="text-violet-300" />
          </div>
          <p className="mt-5 text-2xl font-semibold text-white">
            {formatCurrency(latestMonth.income)}
          </p>
          <p className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
            <ArrowUpRight size={14} />
            Latest sample month
          </p>
        </article>

        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Monthly expenses</p>
            <ArrowDownRight size={18} className="text-cyan-300" />
          </div>
          <p className="mt-5 text-2xl font-semibold text-white">
            {formatCurrency(latestMonth.expenses)}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Latest sample month
          </p>
        </article>

        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Savings rate</p>
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <p className="mt-5 text-2xl font-semibold text-white">
            {savingsRate}%
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Income remaining after expenses
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-6 xl:col-span-2">
          <h3 className="font-semibold text-white">
            Income &amp; expenses trend
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Monthly financial activity in USD
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="incomeFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8B73FF"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#8B73FF"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="expensesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#36C8E8"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#36C8E8"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

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
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#8B73FF"
                  strokeWidth={2.5}
                  fill="url(#incomeFill)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#36C8E8"
                  strokeWidth={2.5}
                  fill="url(#expensesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-white/[0.07] bg-[#101120] p-6">
          <h3 className="font-semibold text-white">Spending by category</h3>
          <p className="mt-1 text-xs text-slate-500">
            Latest sample month
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={75}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar
                  dataKey="amount"
                  name="Expenses"
                  fill="#8B73FF"
                  radius={[0, 5, 5, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.10] to-[#101120] p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">
              Financial observation
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Based on the sample October figures, expenses account for about
              half of income. Review recurring costs and discretionary spending
              to identify potential savings opportunities.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Demo data · Connect your financial data to unlock personalized insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}