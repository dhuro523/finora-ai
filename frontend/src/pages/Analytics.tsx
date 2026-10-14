import useCurrency from '../utils/formatCurrency';


2.
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
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  Sparkles,
  CircleDollarSign,
} from 'lucide-react';

const monthlyData = [
  { month: 'May', income: 5200, expenses: 3400 },
  { month: 'Jun', income: 5800, expenses: 3600 },
  { month: 'Jul', income: 5500, expenses: 3200 },
  { month: 'Aug', income: 6100, expenses: 3900 },
  { month: 'Sep', income: 5900, expenses: 3500 },
  { month: 'Oct', income: 6420, expenses: 3185 },
];

const categoryData = [
  { category: 'Housing', amount: 1115 },
  { category: 'Food', amount: 700 },
  { category: 'Transport', amount: 541 },
  { category: 'Shopping', amount: 446 },
  { category: 'Other', amount: 383 },
];

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E8E8F0',
  borderRadius: '12px',
  color: '#16161D',
  fontSize: '12px',
  boxShadow: '0 8px 24px rgba(30, 25, 60, 0.06)',
};



const cardClass =
  'rounded-2xl border border-[#E8E8F0] bg-white p-5 sm:p-6';

export default function Analytics() {
  const formatCurrency = useCurrency();
  const latestMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const savings = latestMonth.income - latestMonth.expenses;
  const savingsRate = Math.round((savings / latestMonth.income) * 100);
  const incomeChange =
    ((latestMonth.income - previousMonth.income) / previousMonth.income) * 100;
  const expenseChange =
    ((latestMonth.expenses - previousMonth.expenses) / previousMonth.expenses) *
    100;

  const metrics = [
    {
      label: 'Monthly income',
      value: formatCurrency(latestMonth.income),
      caption: `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}% vs. previous month`,
      icon: Wallet,
      positive: incomeChange >= 0,
      iconStyle: 'bg-[#F0EBFF] text-[#7C5CFC]',
    },
    {
      label: 'Monthly expenses',
      value: formatCurrency(latestMonth.expenses),
      caption: `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}% vs. previous month`,
      icon: ArrowDownRight,
      positive: expenseChange <= 0,
      iconStyle: 'bg-[#EAF5F2] text-[#418C7F]',
    },
    {
      label: 'Monthly savings',
      value: formatCurrency(savings),
      caption: 'Income minus expenses',
      icon: CircleDollarSign,
      positive: true,
      iconStyle: 'bg-[#EAF7EF] text-[#16834A]',
    },
    {
      label: 'Savings rate',
      value: `${savingsRate}%`,
      caption: 'Of monthly income retained',
      icon: TrendingUp,
      positive: true,
      iconStyle: 'bg-[#FFF5E7] text-[#B77925]',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 text-[#16161D]">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7C5CFC]">
              Financial intelligence
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            Analytics
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#77778B]">
            Understand your patterns, track your progress, and make more
            informed financial decisions.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#E8E8F0] bg-white px-4 py-2.5 text-sm text-[#55556A]">
          <span className="h-2 w-2 rounded-full bg-[#7C5CFC]" />
          Last 6 months
        </div>
      </section>

      {/* Summary metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(
          ({ label, value, caption, icon: Icon, positive, iconStyle }) => (
            <article
              key={label}
              className={`${cardClass} transition-colors duration-200 hover:border-[#DCD4FF]`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-[#6B6B80]">{label}</p>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                >
                  <Icon size={19} strokeWidth={1.9} />
                </div>
              </div>

              <p className="mt-5 text-[26px] font-semibold tracking-tight tabular-nums text-[#16161D]">
                {value}
              </p>

              <div className="mt-3 flex items-center gap-1.5">
                {label !== 'Monthly savings' && label !== 'Savings rate' && (
                  positive ? (
                    <ArrowUpRight size={14} className="text-[#16834A]" />
                  ) : (
                    <ArrowDownRight size={14} className="text-[#DC2626]" />
                  )
                )}
                <p
                  className={`text-xs ${
                    label === 'Monthly savings' || label === 'Savings rate'
                      ? 'text-[#85859A]'
                      : positive
                        ? 'text-[#16834A]'
                        : 'text-[#DC2626]'
                  }`}
                >
                  {caption}
                </p>
              </div>
            </article>
          ),
        )}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <article className={`${cardClass} min-w-0 xl:col-span-2`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#242430]">
                Income & expenses
              </h2>
              <p className="mt-1.5 text-sm text-[#85859A]">
                Monthly cash flow over the last six months
              </p>
            </div>

            <span className="rounded-lg bg-[#FAFAFD] px-3 py-1.5 text-xs font-medium text-[#77778B] ring-1 ring-[#EEEEF4]">
              USD · Demo data
            </span>
          </div>

          <div className="mt-7 h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 5, right: 5, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="analyticsIncomeFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient
                    id="analyticsExpensesFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#65B9AD" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#65B9AD" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#EEEEF4" vertical={false} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#85859A', fontSize: 12 }}
                  tickMargin={12}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#85859A', fontSize: 11 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  width={45}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                  cursor={{ stroke: '#DCD4FF', strokeDasharray: '4 4' }}
                />

                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#7C5CFC"
                  strokeWidth={2.5}
                  fill="url(#analyticsIncomeFill)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#7C5CFC' }}
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#65B9AD"
                  strokeWidth={2.5}
                  fill="url(#analyticsExpensesFill)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#65B9AD' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 border-t border-[#F0F0F5] pt-4">
            <div className="flex items-center gap-2 text-xs text-[#6B6B80]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7C5CFC]" />
              Income
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6B80]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#65B9AD]" />
              Expenses
            </div>
          </div>
        </article>

        <article className={`${cardClass} min-w-0`}>
          <div>
            <h2 className="text-base font-semibold text-[#242430]">
              Spending by category
            </h2>
            <p className="mt-1.5 text-sm text-[#85859A]">
              Illustrative monthly breakdown
            </p>
          </div>

          <div className="mt-6 h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              >
                <CartesianGrid stroke="#EEEEF4" horizontal={false} />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#85859A', fontSize: 10 }}
                  tickFormatter={(value) => `$${value}`}
                />

                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B6B80', fontSize: 11 }}
                  width={78}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                  cursor={{ fill: '#F7F5FF' }}
                />

                <Bar
                  dataKey="amount"
                  name="Expenses"
                  fill="#7C5CFC"
                  radius={[0, 5, 5, 0]}
                  barSize={17}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 border-t border-[#F0F0F5] pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#85859A]">
                Highest category
              </span>
              <span className="text-sm font-semibold text-[#292936]">
                Housing
              </span>
            </div>
            <p className="mt-1 text-right text-lg font-semibold tabular-nums">
              {formatCurrency(categoryData[0].amount)}
            </p>
          </div>
        </article>
      </section>

      {/* Financial observation */}
      <section className="rounded-2xl border border-[#E8E0FF] bg-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#7C5CFC]">
            <Sparkles size={21} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-[#242430]">
                Financial observation
              </h2>
              <span className="rounded-full bg-[#F0EBFF] px-2 py-1 text-[10px] font-semibold text-[#6845E8]">
                SAMPLE ANALYSIS
              </span>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B6B80]">
              In the sample October figures, you retain{' '}
              <span className="font-semibold text-[#292936]">
                {formatCurrency(savings)}
              </span>{' '}
              after expenses, equivalent to a{' '}
              <span className="font-semibold text-[#292936]">
                {savingsRate}% savings rate
              </span>
              . Compare recurring costs across months to understand where your
              spending changes.
            </p>

            <p className="mt-3 text-xs leading-5 text-[#9292A5]">
              Based on illustrative figures only. No bank account is connected.
            </p>
          </div>
        </div>
      </section>

      {/* Data disclosure */}
      <footer className="flex items-center gap-2 pb-2 text-xs text-[#85859A]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
        All figures are sample data · Currency: USD
      </footer>
    </div>
  );
}
