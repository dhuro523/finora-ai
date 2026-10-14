
import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  RefreshCw,
  Sparkles,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link } from 'react-router-dom';
import {
  checkBackend,
  getFinancialInsights,
  type FinancialInsights,
  type FinancialTransaction,
} from '../api/client';

const cashFlow = [
  { month: 'May', income: 4200, expenses: 2850 },
  { month: 'Jun', income: 4600, expenses: 3100 },
  { month: 'Jul', income: 4400, expenses: 2900 },
  { month: 'Aug', income: 5100, expenses: 3200 },
  { month: 'Sep', income: 4800, expenses: 3050 },
  { month: 'Oct', income: 5400, expenses: 3250 },
];

const transactions: FinancialTransaction[] = [
  { name: 'Monthly salary', category: 'Income', amount: 5400, type: 'income', date: '2026-10-01' },
  { name: 'Apartment rent', category: 'Housing', amount: 950, type: 'expense', date: '2026-10-02' },
  { name: 'Groceries', category: 'Food', amount: 200, type: 'expense', date: '2026-10-03' },
  { name: 'Shopping', category: 'Shopping', amount: 120, type: 'expense', date: '2026-10-04' },
  { name: 'Transport', category: 'Transport', amount: 65, type: 'expense', date: '2026-10-05' },
];

const colors = ['#7C5CFC', '#65B9AD', '#F2B76D', '#85A8D9', '#B5B5C7'];

const money = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);

const cardClass = 'rounded-2xl border border-[#E8E8F0] bg-white p-5 sm:p-6';

export default function Overview() {
  const [backendStatus, setBackendStatus] = useState('Checking');
  const [insights, setInsights] = useState<FinancialInsights | null>(null);
  const [insightsError, setInsightsError] = useState('');

  useEffect(() => {
    let active = true;

    checkBackend()
      .then(() => {
        if (active) setBackendStatus('Connected');
      })
      .catch(() => {
        if (active) {
          setBackendStatus('Offline');
          setInsightsError('Could not connect to the financial analysis API.');
        }
      });

    getFinancialInsights(transactions)
      .then((data) => {
        if (active) {
          setInsights(data);
          setInsightsError('');
        }
      })
      .catch(() => {
        if (active) {
          setInsightsError('Financial insights are temporarily unavailable.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const spending =
    insights?.spending_by_category.map((item, index) => ({
      name: item.category,
      value: item.amount,
      color: colors[index % colors.length],
    })) ?? [];

  const totalIncome = insights?.total_income ?? 0;
  const totalExpenses = insights?.total_expenses ?? 0;
  const netSavings = insights?.net_savings ?? 0;
  const savingsRate = insights?.savings_rate ?? 0;

  const metricCards = [
    {
      label: 'Demo account balance',
      value: '$24,680.50',
      note: 'Illustrative sample balance',
      icon: Wallet,
      iconClass: 'bg-[#F0EBFF] text-[#7C5CFC]',
    },
    {
      label: 'Sample income',
      value: money(totalIncome),
      note: 'Calculated by the Python API',
      icon: ArrowUpRight,
      iconClass: 'bg-[#EAF7EF] text-[#16834A]',
    },
    {
      label: 'Sample expenses',
      value: money(totalExpenses),
      note: 'Calculated by the Python API',
      icon: CreditCard,
      iconClass: 'bg-[#F0F4FA] text-[#5979AA]',
    },
    {
      label: 'Savings rate',
      value: `${savingsRate.toFixed(1)}%`,
      note: 'Based on sample transactions',
      icon: Sparkles,
      iconClass: 'bg-[#FFF5E7] text-[#B77925]',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 text-[#16161D]">
      {/* Page heading */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7C5CFC]">
              Your financial workspace
            </p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            Financial overview
          </h1>
          <p className="mt-2 text-sm text-[#77778B]">
            Understand your money at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#E8E8F0] bg-white px-3 py-2 text-xs text-[#6B6B80]">
          <span
            className={`h-2 w-2 rounded-full ${
              backendStatus === 'Connected'
                ? 'bg-[#16A34A]'
                : backendStatus === 'Offline'
                  ? 'bg-[#DC2626]'
                  : 'bg-[#D99A31]'
            }`}
          />
          API {backendStatus}
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value, note, icon: Icon, iconClass }) => (
          <div
            key={label}
            className={`${cardClass} transition-colors duration-200 hover:border-[#DCD4FF]`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-[#6B6B80]">{label}</p>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
                <Icon size={19} strokeWidth={1.9} />
              </div>
            </div>
            <p className="mt-5 break-words text-[25px] font-semibold tracking-tight tabular-nums text-[#16161D]">
              {value}
            </p>
            <p className="mt-2 text-xs text-[#85859A]">{note}</p>
          </div>
        ))}
      </section>

      {/* Cash flow and spending */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={`${cardClass} min-w-0 xl:col-span-2`}>
          <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Cash flow</h2>
              <p className="mt-1.5 text-sm text-[#85859A]">
                Illustrative six-month history
              </p>
            </div>
            <span className="rounded-lg border border-[#E8E8F0] bg-[#FAFAFD] px-3 py-1.5 text-xs font-medium text-[#77778B]">
              Demo data
            </span>
          </div>

          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#65B9AD" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#65B9AD" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#EEEEF4" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#85859A', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                />
                <YAxis
                  tick={{ fill: '#85859A', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                  width={45}
                />
                <Tooltip
                  formatter={(value) => money(Number(value))}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E8F0',
                    borderRadius: 12,
                    color: '#16161D',
                    fontSize: 12,
                    boxShadow: '0 8px 24px rgba(30, 25, 60, 0.06)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#7C5CFC"
                  strokeWidth={2.5}
                  fill="url(#incomeFill)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#7C5CFC' }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#65B9AD"
                  strokeWidth={2.5}
                  fill="url(#expenseFill)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#65B9AD' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 border-t border-[#F0F0F5] pt-4 text-xs text-[#6B6B80]">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#7C5CFC]" />
              Income
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#65B9AD]" />
              Expenses
            </span>
          </div>
        </div>

        <div className={`${cardClass} min-w-0`}>
          <div>
            <h2 className="text-base font-semibold">Spending breakdown</h2>
            <p className="mt-1.5 text-sm text-[#85859A]">
              Calculated from submitted transactions
            </p>
          </div>

          <div className="relative mt-3 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spending}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={79}
                  paddingAngle={3}
                  stroke="none"
                >
                  {spending.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => money(Number(value))}
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E8F0',
                    borderRadius: 12,
                    color: '#16161D',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-[#85859A]">Total expenses</span>
              <span className="mt-1 text-lg font-semibold tabular-nums">
                {money(totalExpenses)}
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-4">
            {spending.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5 text-sm text-[#6B6B80]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="shrink-0 text-sm font-medium tabular-nums text-[#292936]">
                  {money(item.value)}
                </span>
              </div>
            ))}
            {spending.length === 0 && (
              <p className="py-3 text-center text-sm text-[#85859A]">
                {insights ? 'No expense categories to display.' : 'Loading spending data…'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Transactions and AI insight */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className={`${cardClass} min-w-0 xl:col-span-2`}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Recent transactions</h2>
              <p className="mt-1.5 text-sm text-[#85859A]">
                Sample activity sent to the backend for analysis
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-xs font-semibold text-[#7C5CFC] transition hover:text-[#6845E8]"
            >
              View transactions →
            </Link>
          </div>

          <div className="divide-y divide-[#F0F0F5]">
            {transactions.map((transaction) => {
              const Icon =
                transaction.type === 'income'
                  ? Wallet
                  : transaction.category === 'Food'
                    ? CircleDollarSign
                    : transaction.category === 'Housing'
                      ? CreditCard
                      : RefreshCw;

              return (
                <div
                  key={transaction.name}
                  className="flex items-center justify-between gap-3 py-4 first:pt-2 last:pb-1"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-[#EAF7EF] text-[#16834A]'
                          : 'bg-[#F5F5FA] text-[#77778B]'
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#292936]">
                        {transaction.name}
                      </p>
                      <p className="mt-1 text-xs text-[#85859A]">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`whitespace-nowrap text-sm font-semibold tabular-nums ${
                      transaction.type === 'income'
                        ? 'text-[#16834A]'
                        : 'text-[#292936]'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {money(Math.abs(transaction.amount))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${cardClass} relative overflow-hidden`}>
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#F0EBFF] blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#7C5CFC]">
              <Bot size={22} strokeWidth={1.8} />
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">Finora AI insight</h2>
              <Sparkles size={15} className="text-[#7C5CFC]" />
            </div>

            {insights ? (
              <>
                <p className="mt-3 text-sm leading-6 text-[#6B6B80]">
                  {insights.summary}
                </p>

                {insights.largest_expense_category && (
                  <div className="mt-5 rounded-xl border border-[#E8E0FF] bg-[#FAF8FF] p-4">
                    <p className="text-xs font-medium text-[#7C5CFC]">
                      Largest expense category
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#292936]">
                      {insights.largest_expense_category.category}
                    </p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-[#16161D]">
                      {money(insights.largest_expense_category.amount)}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-xs leading-5 text-[#85859A]">
                  Summary calculated by Finora's Python API. This is not an AI-generated recommendation.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#77778B]">
                {insightsError || 'Analyzing sample transactions…'}
              </p>
            )}

            <Link
              to="/copilot"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6845E8]"
            >
              <Sparkles size={16} />
              Ask Finora AI
            </Link>
          </div>
        </div>
      </section>

      {/* Demo-data disclosure */}
      <footer className="flex flex-wrap items-center gap-2 pb-2 text-xs text-[#85859A]">
        <CheckCircle2 size={15} className="text-[#16A34A]" />
        Demo transactions · No bank account connected
        <span className="sr-only">
          Net savings: {money(netSavings)}
          <ArrowDownRight />
        </span>
      </footer>
    </div>
  );
}
