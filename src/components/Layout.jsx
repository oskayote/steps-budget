// App shell with fully responsive navigation:
//  - mobile  : top bar + fixed bottom tab bar (thumb-friendly)
//  - tablet  : same bottom bar, wider content
//  - desktop : left sidebar, no bottom bar
import { useTheme } from '../context/ThemeContext'

const NAV = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'transactions', label: 'Activity', icon: '💳' },
  { id: 'budgets', label: 'Budgets', icon: '🎯' },
  { id: 'recurring', label: 'Recurring', icon: '🔁' },
  { id: 'themes', label: 'Themes', icon: '🎨' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-primary text-primary-fg grid place-items-center font-extrabold text-lg shadow-sm">
        S
      </div>
      <div className="leading-tight">
        <div className="font-extrabold tracking-tight">Steps</div>
        <div className="text-[11px] text-muted -mt-0.5">Budget</div>
      </div>
    </div>
  )
}

export default function Layout({ active, onNavigate, children }) {
  const { current } = useTheme()
  return (
    <div className="min-h-full flex themed-transition">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-border bg-surface p-5 gap-2">
        <div className="px-1 mb-4">
          <Logo />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                active === item.id
                  ? 'bg-primary text-primary-fg'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto text-[11px] text-muted px-2">
          Theme: <span className="text-text font-medium">{current.name}</span>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile / tablet top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between">
          <Logo />
          <span className="text-xs text-muted">{current.name}</span>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile / tablet bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-surface/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                active === item.id ? 'text-primary' : 'text-muted'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
