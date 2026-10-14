import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Overview from './pages/Overview'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#101120] p-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
        Finora AI
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">
        This section is coming soon. We'll build it step by step.
      </p>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Overview />} />
          <Route
            path="/analytics"
            element={<PlaceholderPage title="Financial Analytics" />}
          />
          <Route
            path="/transactions"
            element={<PlaceholderPage title="Transactions" />}
          />
          <Route
            path="/copilot"
            element={<PlaceholderPage title="AI Copilot" />}
          />
          <Route
            path="/settings"
            element={<PlaceholderPage title="Settings" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}