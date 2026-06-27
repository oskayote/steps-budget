import { useTheme } from '../context/ThemeContext'
import { useBudget } from '../context/BudgetContext'
import { Card, Button } from '../components/ui'

// Live mini-preview of the app rendered in a given theme's colors,
// so the user sees exactly how each theme looks before applying it.
function ThemePreview({ theme }) {
  const c = theme.colors
  const rgb = (v) => `rgb(${v})`
  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ background: rgb(c['--bg']), borderColor: rgb(c['--border']) }}
    >
      <div className="p-3 space-y-2">
        {/* fake balance card */}
        <div className="rounded-lg p-2.5" style={{ background: rgb(c['--surface']), border: `1px solid ${rgb(c['--border'])}` }}>
          <div className="h-1.5 w-10 rounded-full mb-1.5" style={{ background: rgb(c['--muted']) }} />
          <div className="h-3 w-20 rounded" style={{ background: rgb(c['--text']) }} />
        </div>
        {/* fake rows */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md" style={{ background: rgb(c['--primary']) }} />
          <div className="flex-1 h-2 rounded-full" style={{ background: rgb(c['--surface-2']) }} />
          <div className="h-2 w-8 rounded-full" style={{ background: rgb(c['--positive']) }} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md" style={{ background: rgb(c['--accent']) }} />
          <div className="flex-1 h-2 rounded-full" style={{ background: rgb(c['--surface-2']) }} />
          <div className="h-2 w-8 rounded-full" style={{ background: rgb(c['--negative']) }} />
        </div>
        {/* fake button */}
        <div className="h-6 rounded-lg grid place-items-center text-[10px] font-bold"
          style={{ background: rgb(c['--primary']), color: rgb(c['--primary-fg']) }}>
          Button
        </div>
      </div>
    </div>
  )
}

export default function Themes() {
  const { themes, themeId, setThemeId, current } = useTheme()
  const { resetAll, clearAll } = useBudget()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Themes</h1>
        <p className="text-muted mt-1">Pick a look — applies instantly across the whole app.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const selected = theme.id === themeId
          return (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              className={`text-left rounded-2xl border-2 p-3 transition focus:outline-none ${
                selected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
              }`}
            >
              <ThemePreview theme={theme} />
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {theme.swatch.map((s, i) => (
                      <span key={i} className="w-4 h-4 rounded-full border-2 border-surface" style={{ background: s }} />
                    ))}
                  </div>
                  <span className="font-bold text-sm">{theme.name}</span>
                </div>
                {selected ? (
                  <span className="text-xs font-bold text-primary">✓ Active</span>
                ) : (
                  <span className="text-xs text-muted capitalize">{theme.scheme}</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Data management */}
      <Card className="p-5">
        <h2 className="font-bold mb-1">Data</h2>
        <p className="text-sm text-muted mb-4">
          Everything is stored privately on this device. Currently using <span className="font-semibold text-text">{current.name}</span>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="soft" onClick={() => { if (confirm('Reload the sample demo data? This replaces current data.')) resetAll() }}>
            Reload sample data
          </Button>
          <Button variant="danger" onClick={() => { if (confirm('Clear all transactions, budgets and recurring items?')) clearAll() }}>
            Clear all data
          </Button>
        </div>
      </Card>
    </div>
  )
}
