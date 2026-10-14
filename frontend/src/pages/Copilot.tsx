
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Bot,
  Send,
  User,
  Sparkles,
  RotateCcw,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'
import {
  demoStats,
  demoSpending,
  demoSavingsGoal,
  demoCashFlow,
  demoCurrency,
} from '../data/finance'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const API_URL = 'http://127.0.0.1:8000/api/chat'
const STORAGE_KEY = 'finora-copilot-messages'
const MAX_HISTORY_MESSAGES = 40

const initialMessage: Message = {
  role: 'assistant',
  content:
    "Hey! I'm your Finora AI financial copilot. 👋\n\nI can help you understand your spending, find savings opportunities, and make smarter financial decisions using the figures in your dashboard.\n\nWhat would you like to explore?",
}

const suggestions = [
  'Where does most of my money go?',
  'How can I save more each month?',
  'Analyze my financial health',
  'Give me a plan to reduce expenses',
]

function loadSavedMessages(): Message[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)

    if (!saved) return [initialMessage]

    const parsed: unknown = JSON.parse(saved)

    if (
      !Array.isArray(parsed) ||
      !parsed.every(
        (message) =>
          message &&
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string',
      )
    ) {
      return [initialMessage]
    }

    return parsed.length > 0 ? parsed : [initialMessage]
  } catch {
    return [initialMessage]
  }
}

function getFinancialContext() {
  return {
    data_source: 'Finora demo dashboard data',
    currency: demoCurrency,
    total_balance: demoStats[0].value,
    monthly_income: demoStats[1].value,
    monthly_expenses: demoStats[2].value,
    savings_rate: demoStats[3].value,
    spending_categories: demoSpending.map((category) => ({
      name: category.name,
      amount: category.amount,
      share: category.share,
    })),
    savings_goal: {
      saved: demoSavingsGoal.saved,
      target: demoSavingsGoal.target,
      remaining: Math.max(
        0,
        demoSavingsGoal.target - demoSavingsGoal.saved,
      ),
      progress_percentage:
        demoSavingsGoal.target > 0
          ? Math.round(
              (demoSavingsGoal.saved / demoSavingsGoal.target) * 100,
            )
          : 0,
    },
    recent_cash_flow: demoCashFlow,
    note: 'These are demonstration figures, not verified bank account data.',
  }
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="min-w-0 text-sm leading-7 text-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-bold tracking-tight text-slate-900 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 text-lg font-bold tracking-tight text-slate-900 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-base font-semibold text-slate-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-900">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1.5 marker:text-violet-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1.5 marker:font-semibold marker:text-violet-600">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-violet-300 pl-4 italic text-slate-600">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-5 border-slate-200" />,
          table: ({ children }) => (
            <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[320px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-3 font-semibold text-slate-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-3 py-3 text-slate-600">
              {children}
            </td>
          ),
          code: ({ children, className }) =>
            className ? (
              <code className="font-mono text-xs leading-6 text-slate-100">
                {children}
              </code>
            ) : (
              <code className="rounded bg-violet-50 px-1.5 py-0.5 font-mono text-[0.85em] text-violet-700">
                {children}
              </code>
            ),
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-600 underline underline-offset-2 hover:text-violet-800"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function SavingsInsightCard({
  onSelectCategory,
}: {
  onSelectCategory: (category: string) => void
}) {
  const goalProgress =
    demoSavingsGoal.target > 0
      ? Math.min(
          100,
          Math.round(
            (demoSavingsGoal.saved / demoSavingsGoal.target) * 100,
          ),
        )
      : 0

  const categories = demoSpending.filter(
    (category) => category.amount > 0,
  )

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[#E8E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#6B6B80]">
              Spending breakdown
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#16161D]">
              Explore your expenses
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EBFF] text-[#7C5CFC]">
            <Sparkles size={20} />
          </div>
        </div>

        <p className="mt-2 text-sm leading-6 text-[#6B6B80]">
          Select a category to ask Finora AI for practical ways to manage
          your spending. Potential savings depend on your circumstances.
        </p>

        <div className="mt-5 space-y-2">
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-[#E8E8F0] hover:bg-[#F7F7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFC]"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[#16161D]">
                  {category.name}
                </span>
                <span className="mt-1 block text-xs text-[#6B6B80]">
                  {category.share}% of tracked spending
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[#16161D]">
                {demoCurrency}
                {category.amount.toLocaleString()}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 border-t border-[#E8E8F0] pt-3 text-xs text-[#6B6B80]">
          Illustrative demo data, not verified bank transactions or
          guaranteed savings.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E8E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#6B6B80]">
              Savings goal
            </p>
            <h3 className="mt-1 text-lg font-bold text-[#16161D]">
              Build your safety net
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="mt-7 flex items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold tracking-tight text-[#16161D]">
              {demoCurrency}
              {demoSavingsGoal.saved.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-[#6B6B80]">
              of {demoCurrency}
              {demoSavingsGoal.target.toLocaleString()} target
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            {goalProgress}%
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F0F0F5]">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${goalProgress}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[#6B6B80]">Still to save</span>
          <span className="font-semibold text-[#16161D]">
            {demoCurrency}
            {Math.max(
              0,
              demoSavingsGoal.target - demoSavingsGoal.saved,
            ).toLocaleString()}
          </span>
        </div>

        <p className="mt-5 text-xs leading-5 text-[#6B6B80]">
          Illustrative goal progress using Finora's sample dashboard data.
        </p>
      </div>
    </div>
  )
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>(loadSavedMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (storageError) {
      console.error('Could not save Finora chat history:', storageError)
    }
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string, retry = false) {
    const content = (text ?? input).trim()

    if (!content || loading) return

    const previousMessages = messages.filter(
      (message) => message.content !== initialMessage.content,
    )

    if (!retry) {
      setMessages((current) => [
        ...current,
        { role: 'user', content },
      ])
    }

    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          history: previousMessages.slice(-MAX_HISTORY_MESSAGES),
          financial_context: getFinancialContext(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to get a response. Please try again.',
        )
      }

      const answer =
        data.answer ??
        data.response ??
        data.message ??
        'I could not generate a response. Please try again.'

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: answer },
      ])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to Finora AI. Check that the backend is running.',
      )
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function askAboutCategory(category: string) {
    void sendMessage(
      `Help me manage my ${category} expenses. Use the confirmed dashboard figures to understand this category. Suggest practical steps, and do not invent a specific savings amount or percentage unless it can be calculated from confirmed data. Clearly label any hypothetical examples.`,
    )
  }

  function retryLastMessage() {
    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === 'user')

    if (lastUserMessage) {
      void sendMessage(lastUserMessage.content, true)
    }
  }

  function resetChat() {
    const freshMessages = [initialMessage]
    setMessages(freshMessages)
    setInput('')
    setError('')

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshMessages))
    } catch (storageError) {
      console.error('Could not reset Finora chat history:', storageError)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] min-h-[520px] max-w-5xl flex-col">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Copilot
            </h1>
            <p className="text-xs text-slate-500">
              Your personal financial assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetChat}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={15} />
          <span className="hidden sm:inline">New chat</span>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Bot size={21} />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Finora AI</p>
            <p className="text-xs text-emerald-600">Ready to help</p>
          </div>

          <div className="ml-auto hidden items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 sm:flex">
            <Sparkles size={13} />
            Financial insights
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
          <SavingsInsightCard onSelectCategory={askAboutCategory} />

          {messages.map((message, index) => {
            const isUser = message.role === 'user'

            return (
              <div
                key={`${index}-${message.role}`}
                className={`flex items-start gap-3 ${
                  isUser ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isUser
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-violet-100 text-violet-600'
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={17} />}
                </div>

                <div
                  className={`min-w-0 max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[85%] ${
                    isUser
                      ? 'rounded-tr-md bg-violet-600 text-white'
                      : 'rounded-tl-md bg-slate-50'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-white">
                      {message.content}
                    </p>
                  ) : (
                    <MarkdownMessage content={message.content} />
                  )}
                </div>
              </div>
            )
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Bot size={17} />
              </div>

              <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <LoaderCircle
                  size={16}
                  className="animate-spin text-violet-500"
                />
                Analyzing your finances...
              </div>
            </div>
          )}

          {error && (
            <div className="mx-1 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={retryLastMessage}
                  disabled={loading}
                  className="mt-2 font-semibold underline underline-offset-2 disabled:opacity-50"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="pt-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Suggested questions
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => void sendMessage(suggestion)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void sendMessage()
          }}
          className="border-t border-slate-100 bg-white p-4 sm:p-5"
        >
          <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void sendMessage()
                }
              }}
              placeholder="Ask about your spending, savings, or financial goals..."
              rows={1}
              className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Finora uses demo dashboard figures for now. AI responses may not
            always be accurate.
          </p>
        </form>
      </div>
    </div>
  )
}
