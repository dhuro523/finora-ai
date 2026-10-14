
const API_BASE_URL = 'http://127.0.0.1:8000';

export interface FinancialTransaction {
  name: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface FinancialInsights {
  currency: string;
  transaction_count: number;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  savings_rate: number;
  largest_expense_category: {
    category: string;
    amount: number;
  } | null;
  spending_by_category: {
    category: string;
    amount: number;
  }[];
  summary: string;
  data_source: string;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function checkBackend(): Promise<{ status: string }> {
  return apiRequest<{ status: string }>('/health');
}

export function getFinancialInsights(
  transactions: FinancialTransaction[],
): Promise<FinancialInsights> {
  return apiRequest<FinancialInsights>('/api/insights', {
    method: 'POST',
    body: JSON.stringify({ transactions }),
  });
}
