
import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  SlidersHorizontal,
  Download,
  ShoppingBag,
  House,
  Car,
  Utensils,
  BriefcaseBusiness,
  HeartPulse,
  CircleDollarSign,
  CalendarDays,
  X,
} from 'lucide-react'

type Transaction = {
  id: number
  merchant: string
  category: string
  date: string
  amount: number
  type: 'income' | 'expense'
  account: string
}

const demoTransactions: Transaction[] = [
  { id: 1, merchant: 'Salary Payment', category: 'Income', date: '2026-10-14', amount: 4200, type: 'income', account: 'Main Account' },
  { id: 2, merchant: 'Whole Foods Market', category: 'Groceries', date: '2026-10-13', amount: 86.45, type: 'expense', account: 'Visa •• 4821' },
  { id: 3, merchant: 'Netflix', category: 'Subscriptions', date: '2026-10-12', amount: 15.99, type: 'expense', account: 'Visa •• 4821' },
  { id: 4, merchant: 'Uber', category: 'Transport', date: '2026-10-11', amount: 24.5, type: 'expense', account: 'Visa •• 4821' },
  { id: 5, merchant: 'Freelance Project', category: 'Income', date: '2026-10-10', amount: 850, type: 'income', account: 'Main Account' },
  { id: 6, merchant: 'Amazon', category: 'Shopping', date: '2026-10-09', amount: 129.99, type: 'expense', account: 'Visa •• 4821' },
  { id: 7, merchant: 'Electricity Bill', category: 'Utilities', date: '2026-10-08', amount: 74.2, type: 'expense', account: 'Main Account' },
  { id: 8, merchant: 'Local Restaurant', category: 'Food & Dining', date: '2026-10-07', amount: 42.8, type: 'expense', account: 'Visa •• 4821' },
  { id: 9, merchant: 'Gym Membership', category: 'Health', date: '2026-10-06', amount: 35, type: 'expense', account: 'Visa •• 4821' },
  { id: 10, merchant: 'Rent Payment', category: 'Housing', date: '2026-10-05', amount: 950, type: 'expense', account: 'Main Account' },
  { id: 11, merchant: 'Coffee Shop', category: 'Food & Dining', date: '2026-10-04', amount: 8.5, type: 'expense', account: 'Visa •• 4821' },
  { id: 12, merchant: 'Online Consulting', category: 'Income', date: '2026-10-02', amount: 320, type: 'income', account: 'Main Account' },
]

const categoryIcons: Record<string, typeof ShoppingBag> = {
  Income: CircleDollarSign,
  Groceries: ShoppingBag,
  Subscriptions: CircleDollarSign,
  Transport: Car,
  Shopping: ShoppingBag,
  Utilities: House,
  'Food & Dining': Utensils,
  Health: HeartPulse,
  Housing: House,
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

export default function Transactions() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [type, setType] = useState('All transactions')
  const [period, setPeriod] = useState('All time')

  const categories = [
    'All categories',
    ...Array.from(new Set(demoTransactions.map((transaction) => transaction.category))),
  ]

  const filteredTransactions = useMemo(() => {
    return demoTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.merchant.toLowerCase().includes(search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'All categories' || transaction.category === category

      const matchesType =
        type === 'All transactions' || transaction.type === type

      const transactionDate = new Date(`${transaction.date}T12:00:00`)
      const now = new Date()
      const matchesPeriod =
        period === 'All time' ||
        (period === 'This month' &&
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()) ||
        (period === 'Last 30 days' &&
          transactionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000))

      return matchesSearch && matchesCategory && matchesType && matchesPeriod
    })
  }, [search, category, type, period])

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  return (
    <div className="space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Manage your money</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Track your income and expenses in one place.
          </p>
        </div>
        <button
          onClick={() => {
            const csv = [
              ['Date', 'Merchant', 'Category', 'Type', 'Account', 'Amount'],
              ...filteredTransactions.map((transaction) => [
                transaction.date,
                transaction.merchant,
                transaction.category,
                transaction.type,
                transaction.account,
                transaction.amount.toFixed(2),
              ]),
            ]
              .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
              .join('\n')

            const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
            const link = document.createElement('a')
            link.href = url
            link.download = 'finora-transactions.csv'
            link.click()
            URL.revokeObjectURL(url)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Income"
          amount={totalIncome}
          count={filteredTransactions.filter((transaction) => transaction.type === 'income').length}
          icon={<ArrowDownLeft size={19} />}
          positive
        />
        <SummaryCard
          label="Expenses"
          amount={totalExpenses}
          count={filteredTransactions.filter((transaction) => transaction.type === 'expense').length}
          icon={<ArrowUpRight size={19} />}
        />
        <SummaryCard
          label="Net cash flow"
          amount={totalIncome - totalExpenses}
          count={filteredTransactions.length}
          icon={<WalletIcon />}
          positive={totalIncome - totalExpenses >= 0}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11131b]">
        <div className="border-b border-white/[0.07] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400/50"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="min-w-36 rounded-xl border border-white/[0.08] bg-[#171923] px-3 py-3 text-sm text-slate-200 outline-none focus:border-violet-400/50"
              >
                <option>All transactions</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="min-w-36 rounded-xl border border-white/[0.08] bg-[#171923] px-3 py-3 text-sm text-slate-200 outline-none focus:border-violet-400/50"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="min-w-32 rounded-xl border border-white/[0.08] bg-[#171923] px-3 py-3 text-sm text-slate-200 outline-none focus:border-violet-400/50"
              >
                <option>All time</option>
                <option>This month</option>
                <option>Last 30 days</option>
              </select>

              <button
                onClick={() => {
                  setSearch('')
                  setCategory('All categories')
                  setType('All transactions')
                  setPeriod('All time')
                }}
                title="Reset filters"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <SlidersHorizontal size={16} />
                <span className="hidden xl:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.015] text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4 font-medium">Transaction</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Account</th>
                <th className="px-5 py-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const Icon = categoryIcons[transaction.category] ?? CircleDollarSign

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/[0.045] transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            transaction.type === 'income'
                              ? 'bg-emerald-400/10 text-emerald-400'
                              : 'bg-white/[0.06] text-slate-300'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-100">
                            {transaction.merchant}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-xs text-slate-300">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {transaction.account}
                    </td>
                    <td
                      className={`px-5 py-4 text-right text-sm font-semibold tabular-nums ${
                        transaction.type === 'income'
                          ? 'text-emerald-400'
                          : 'text-slate-100'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '−'}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <Search size={24} className="text-slate-600" />
              <p className="mt-4 text-sm font-medium text-white">No transactions found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearch('')
                  setCategory('All categories')
                  setType('All transactions')
                  setPeriod('All time')
                }}
                className="mt-4 text-sm font-medium text-violet-400 hover:text-violet-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Showing {filteredTransactions.length} of {demoTransactions.length} transactions</span>
          <span>Demo data · No bank account connected</span>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] p-4">
        <CalendarDays size={18} className="mt-0.5 shrink-0 text-violet-300" />
        <div>
          <p className="text-sm font-medium text-slate-200">Your finances, organized</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">
            These sample transactions demonstrate the interface. Once we connect a data source,
            Finora can analyze your actual spending patterns and income.
          </p>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  amount,
  count,
  icon,
  positive,
}: {
  label: string
  amount: number
  count: number
  icon: React.ReactNode
  positive?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#11131b] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            positive
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-rose-400/10 text-rose-400'
          }`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
        {formatCurrency(amount)}
      </p>
      <p className="mt-2 text-xs text-slate-500">{count} transactions</p>
    </div>
  )
}

function WalletIcon() {
  return <BriefcaseBusiness size={19} />
}
