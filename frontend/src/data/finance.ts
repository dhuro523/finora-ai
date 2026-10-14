export interface FinanceStat {
  label: string
  value: string
  change: string
  detail: string
  positive: boolean
}

export interface CashFlowMonth {
  month: string
  income: number
  expenses: number
}

export interface SpendingCategory {
  name: string
  amount: number
  color: string
  share: string
}

export const demoStats: FinanceStat[] = [
  {
    label: 'Total Balance',
    value: '$24,680.50',
    change: '+12.8%',
    detail: 'vs. last month',
    positive: true,
  },
  {
    label: 'Monthly Income',
    value: '$6,420.00',
    change: '+8.2%',
    detail: 'vs. last month',
    positive: true,
  },
  {
    label: 'Monthly Expenses',
    value: '$3,185.40',
    change: '-4.6%',
    detail: 'vs. last month',
    positive: true,
  },
  {
    label: 'Savings Rate',
    value: '50.4%',
    change: '+5.1%',
    detail: 'vs. last month',
    positive: true,
  },
]

export const demoCashFlow: CashFlowMonth[] = [
  { month: 'May', income: 65, expenses: 38 },
  { month: 'Jun', income: 78, expenses: 45 },
  { month: 'Jul', income: 70, expenses: 40 },
  { month: 'Aug', income: 88, expenses: 52 },
  { month: 'Sep', income: 74, expenses: 43 },
  { month: 'Oct', income: 95, expenses: 48 },
]

export const demoSpending: SpendingCategory[] = [
  { name: 'Housing', amount: 1115, color: 'bg-violet-400', share: '35%' },
  { name: 'Food & dining', amount: 700, color: 'bg-cyan-400', share: '22%' },
  { name: 'Transport', amount: 541, color: 'bg-amber-400', share: '17%' },
  { name: 'Shopping', amount: 446, color: 'bg-pink-400', share: '14%' },
  { name: 'Other', amount: 383, color: 'bg-slate-600', share: '12%' },
]

export const demoSavingsGoal = {
  saved: 1200,
  target: 1500,
}

export const demoCurrency = 'USD'