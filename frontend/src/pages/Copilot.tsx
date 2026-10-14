
import { useState } from 'react'
import {
  ArrowUp,
  Sparkles,
  Plus,
  Bot,
  UserRound,
  TrendingUp,
  Wallet,
  ShoppingBag,
  PiggyBank,
  RotateCcw,
} from 'lucide-react'

type Message = {
  id: number
  role: 'assistant' | 'user'
  content: string
}

const suggestions = [
  {
    icon: TrendingUp,
    title: 'Analyze my spending',
    prompt: 'Analyze my spending and tell me where most of my money goes.',
  },
  {
    icon: PiggyBank,
    title: 'Help me save more',
    prompt: 'Give me practical ways to increase my monthly savings.',
  },
  {
    icon: Wallet,
    title: 'Review my cash flow',
    prompt: 'Review my income and expenses and explain my cash flow.',
  },
  {
    icon: ShoppingBag,
    title: 'Find spending patterns',
    prompt: 'What spending patterns should I pay attention to?',
  },
]

function getDemoResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('spend') || q.includes('expense') || q.includes('category')) {
    return "Based on your sample transactions, housing is one of your largest expenses at $950 per month. Groceries, shopping, subscriptions, and dining are also worth tracking.\n\n**A practical next step:** set a monthly budget for flexible categories like dining and shopping, then review them weekly.\n\nThese figures are illustrative demo data, not connected bank activity."
  }

  if (q.includes('sav') || q.includes('save') || q.includes('budget')) {
    return "A good starting point is to set a savings target before spending the rest of your income.\n\n**Try this approach:**\n- Set aside a fixed percentage of income when you receive it.\n- Review subscriptions and recurring expenses monthly.\n- Choose a realistic spending limit for dining and shopping.\n\nOnce your actual financial data is connected, I can help estimate a savings target from your real cash flow."
  }

  if (q.includes('cash flow') || q.includes('income') || q.includes('balance')) {
    return "Your sample transactions include salary and freelance income, along with housing, grocery, transport, and subscription expenses.\n\nTo understand your cash flow, compare total income against total expenses over the same period. Then separate recurring bills from flexible spending.\n\n**Important:** Finora currently uses sample data, so these are general observations rather than a verified view of your finances."
  }

  if (q.includes('pattern') || q.includes('trend') || q.includes('analy')) {
    return "Here are three useful patterns to monitor:\n\n**1. Recurring costs** — track rent, subscriptions, utilities, and memberships.\n\n**2. Flexible spending** — compare dining, groceries, and shopping from week to week.\n\n**3. Income consistency** — distinguish regular salary from freelance payments before setting savings goals.\n\nThese are suggestions based on the demo categories available in Finora, not a complete analysis of real financial activity."
  }

  return "I can help you explore spending, budgeting, savings goals, and cash flow.\n\nFor the most useful answer, ask me something specific, such as **“How can I reduce my monthly expenses?”** or **“Help me create a savings plan.”**\n\nI'm currently running in demo mode, so I don't yet have access to a live AI model or connected bank accounts."
}

export default function Copilot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const sendMessage = (text: string) => {
    const question = text.trim()
    if (!question) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: question,
    }

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: getDemoResponse(question),
    }

    setMessages((current) => [...current, userMessage, assistantMessage])
    setInput('')
  }

  const resetChat = () => {
    setMessages([])
    setInput('')
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-5xl flex-col pb-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
              <Sparkles size={19} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              AI Copilot
            </h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Your personal space to understand your money.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={resetChat}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <RotateCcw size={15} />
            New chat
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <p className="text-xs text-slate-400">
          Demo mode <span className="text-slate-600">·</span> Responses use local example logic, not a live AI model.
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center py-8">
        {messages.length === 0 ? (
          <div className="mx-auto w-full max-w-3xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-400/15 to-cyan-400/10 text-violet-200 shadow-lg shadow-violet-950/20">
              <Sparkles size={29} />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Make your money
                <span className="block bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  make more sense.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                Ask questions, explore spending patterns, and discover practical ways to improve your financial habits.
              </p>
            </div>

            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon

                return (
                  <button
                    key={suggestion.title}
                    onClick={() => sendMessage(suggestion.prompt)}
                    className="group rounded-2xl border border-white/[0.08] bg-[#11131b] p-4 text-left transition hover:border-violet-300/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-violet-300 transition group-hover:bg-violet-400/10">
                        <Icon size={18} />
                      </span>
                      <Plus size={16} className="text-slate-600 transition group-hover:text-violet-300" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-200">
                      {suggestion.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {suggestion.prompt}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    message.role === 'assistant'
                      ? 'bg-violet-400/10 text-violet-300'
                      : 'bg-white/[0.08] text-slate-300'
                  }`}
                >
                  {message.role === 'assistant' ? <Bot size={18} /> : <UserRound size={18} />}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-violet-500/15 text-violet-50'
                      : 'border border-white/[0.07] bg-[#11131b] text-slate-300'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage(input)
        }}
        className="sticky bottom-3 mx-auto w-full max-w-3xl"
      >
        <div className="rounded-2xl border border-white/[0.12] bg-[#151721] p-2 shadow-xl shadow-black/20 transition focus-within:border-violet-300/30">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendMessage(input)
              }
            }}
            rows={2}
            placeholder="Ask Finora anything about your finances..."
            className="max-h-36 min-h-14 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
          />
          <div className="flex items-center justify-between px-2 pb-1">
            <p className="text-[11px] text-slate-600">
              Demo insights only · Enter to send
            </p>
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-600">
          Finora provides educational insights, not professional financial advice.
        </p>
      </form>
    </div>
  )
}
