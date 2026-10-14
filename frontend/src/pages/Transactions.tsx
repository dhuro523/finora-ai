import useCurrency from '../utils/formatCurrency';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
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
} from 'lucide-react';

type Transaction = {
  id: number;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  account: string;
};

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
];

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
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const cardClass =
  'rounded-2xl border border-[#E8E8F0] bg-white p-5 transition-colors duration-200 hover:border-[#DCD4FF]';

const inputClass =
  'w-full rounded-xl border border-[#E8E8F0] bg-white px-3 py-3 text-sm text-[#292936] outline-none transition placeholder:text-[#A0A0B2] focus:border-[#B9A9FF] focus:ring-2 focus:ring-[#7C5CFC]/10';

export default function Transactions() {
  const formatCurrency = useCurrency();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [type, setType] = useState('All transactions');
  const [period, setPeriod] = useState('All time');

  const categories = [
    'All categories',
    ...Array.from(
      new Set(demoTransactions.map((transaction) => transaction.category)),
    ),
  ];

  const filteredTransactions = useMemo(() => {
    return demoTransactions.filter((transaction) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        transaction.merchant.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.account.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All categories' || transaction.category === category;

      const matchesType =
        type === 'All transactions' || transaction.type === type;

      const transactionDate = new Date(`${transaction.date}T12:00:00`);
      const now = new Date();

      const matchesPeriod =
        period === 'All time' ||
        (period === 'This month' &&
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()) ||
        (period === 'Last 30 days' &&
          transactionDate >=
            new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) &&
          transactionDate <= now);

      return (
        matchesSearch && matchesCategory && matchesType && matchesPeriod
      );
    });
  }, [search, category, type, period]);

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const incomeCount = filteredTransactions.filter(
    (transaction) => transaction.type === 'income',
  ).length;

  const expenseCount = filteredTransactions.filter(
    (transaction) => transaction.type === 'expense',
  ).length;

  const netCashFlow = totalIncome - totalExpenses;

  const resetFilters = () => {
    setSearch('');
    setCategory('All categories');
    setType('All transactions');
    setPeriod('All time');
  };

  const exportCSV = () => {
    const rows = [
      ['Date', 'Merchant', 'Category', 'Type', 'Account', 'Amount'],
      ...filteredTransactions.map((transaction) => [
        transaction.date,
        transaction.merchant,
        transaction.category,
        transaction.type,
        transaction.account,
        transaction.amount.toFixed(2),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');

    const blob = new Blob(['\uFEFF', csv], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'finora-transactions.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7 pb-8 text-[#16161D]">
      {/* Page header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC]" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7C5CFC]">
              Money management
            </p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-[30px]">
            Transactions
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#77778B]">
            Every transaction, organized in one clear view.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200/60 transition hover:bg-[#6946F5] active:scale-[0.98]"
        >
          <Download size={16} />
          Export CSV
        </button>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total income"
          amount={totalIncome}
          count={incomeCount}
          icon={<ArrowDownLeft size={19} />}
          iconStyle="bg-[#EAF7EF] text-[#16834A]"
          caption="Money received"
          positive
        />

        <SummaryCard
          label="Total expenses"
          amount={totalExpenses}
          count={expenseCount}
          icon={<ArrowUpRight size={19} />}
          iconStyle="bg-[#FFF0F0] text-[#DC5555]"
          caption="Money spent"
        />

        <SummaryCard
          label="Net cash flow"
          amount={netCashFlow}
          count={filteredTransactions.length}
          icon={<BriefcaseBusiness size={19} />}
          iconStyle={
            netCashFlow >= 0
              ? 'bg-[#F0EBFF] text-[#7C5CFC]'
              : 'bg-[#FFF0F0] text-[#DC5555]'
          }
          caption="Income minus expenses"
          positive={netCashFlow >= 0}
        />
      </section>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-2xl border border-[#E8E8F0] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#EEEEF4] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-[#242430]">
                All transactions
              </h2>
              <p className="mt-1 text-sm text-[#85859A]">
                Search and filter your financial activity.
              </p>
            </div>

            <span className="w-fit rounded-lg bg-[#F7F7FB] px-3 py-1.5 text-xs font-medium text-[#77778B]">
              {filteredTransactions.length} results
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(200px,1fr)_repeat(3,minmax(130px,170px))_auto]">
            <div className="relative min-w-0">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9999AD]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                aria-label="Search transactions"
                className={`${inputClass} pl-10 pr-10`}
              />

              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9999AD] transition hover:text-[#292936]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-label="Filter by transaction type"
              className={inputClass}
            >
              <option value="All transactions">All transactions</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
              className={inputClass}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Filter by period"
              className={inputClass}
            >
              <option value="All time">All time</option>
              <option value="This month">This month</option>
              <option value="Last 30 days">Last 30 days</option>
            </select>

            <button
              onClick={resetFilters}
              title="Reset filters"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E8F0] px-3 py-3 text-sm font-medium text-[#6B6B80] transition hover:border-[#DCD4FF] hover:bg-[#F8F6FF] hover:text-[#6845E8]"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#EEEEF4] bg-[#FAFAFD] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#85859A]">
                <th className="px-5 py-4 font-semibold">Transaction</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Account</th>
                <th className="px-5 py-4 text-right font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => {
                const Icon =
                  categoryIcons[transaction.category] ?? CircleDollarSign;
                const isIncome = transaction.type === 'income';

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-[#F0F0F5] transition-colors last:border-b-0 hover:bg-[#FAF9FF]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isIncome
                              ? 'bg-[#EAF7EF] text-[#16834A]'
                              : 'bg-[#F3F3F8] text-[#68687D]'
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.8} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#292936]">
                            {transaction.merchant}
                          </p>
                          <p className="mt-1 text-xs capitalize text-[#9292A5]">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg border border-[#EEEEF4] bg-[#FAFAFD] px-2.5 py-1.5 text-xs font-medium text-[#68687D]">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#77778B]">
                      {formatDate(transaction.date)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#77778B]">
                      {transaction.account}
                    </td>

                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right text-sm font-semibold tabular-nums ${
                        isIncome ? 'text-[#16834A]' : 'text-[#292936]'
                      }`}
                    >
                      {isIncome ? '+' : '−'}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EBFF] text-[#7C5CFC]">
                <Search size={22} />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#292936]">
                No transactions found
              </p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-[#85859A]">
                Try a different search term or adjust your filters to find what
                you&apos;re looking for.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 text-sm font-semibold text-[#7C5CFC] transition hover:text-[#6946F5]"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EEEEF4] bg-[#FCFCFE] px-5 py-4 text-xs text-[#85859A] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredTransactions.length} of {demoTransactions.length}{' '}
            transactions
          </span>
        <span>Illustrative demo data · Selected currency</span>        </div>
      </section>

      {/* Helpful note */}
      <section className="flex items-start gap-3 rounded-2xl border border-[#E8E0FF] bg-white p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#7C5CFC]">
          <CalendarDays size={19} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#292936]">
            Your finances, organized
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-[#77778B]">
            These transactions are illustrative examples. Connect a real data
            source in a future integration to analyze your actual financial
            activity.
          </p>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  amount,
  count,
  icon,
  iconStyle,
  caption,
  positive,
}: {
  label: string;
  amount: number;
  count: number;
  icon: ReactNode;
  iconStyle: string;
  caption: string;
  positive?: boolean;
}) {
  return (
    <article
      className={`${cardClass} min-w-0`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#6B6B80]">{label}</p>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-5 break-words text-[26px] font-semibold tracking-tight tabular-nums text-[#16161D]">
        {formatCurrency(amount)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
            positive
              ? 'bg-[#EAF7EF] text-[#16834A]'
              : 'bg-[#FFF0F0] text-[#DC5555]'
          }`}
        >
          {count} {count === 1 ? 'transaction' : 'transactions'}
        </span>
        <span className="text-xs text-[#9292A5]">{caption}</span>
      </div>
    </article>
  );
}
