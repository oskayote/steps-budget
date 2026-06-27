import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { BudgetProvider, useBudget } from './context/BudgetContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Recurring from './pages/Recurring'
import Themes from './pages/Themes'

function Shell() {
  const [page, setPage] = useState('dashboard')
  const { ready } = useBudget()

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center text-muted">
        <div className="animate-pulse font-semibold">Loading Steps Budget…</div>
      </div>
    )
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    transactions: <Transactions />,
    budgets: <Budgets />,
    recurring: <Recurring />,
    themes: <Themes />,
  }

  return (
    <Layout active={page} onNavigate={setPage}>
      {pages[page]}
    </Layout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BudgetProvider>
        <Shell />
      </BudgetProvider>
    </ThemeProvider>
  )
}
