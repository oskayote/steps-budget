import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts'
import { useBudget } from '../context/BudgetContext'
import { Card } from '../components/ui'
import {
  formatCurrency, monthlyTotals, totalBalance,
  spendByCategory, monthlyTrend, daysUntil,
} from '../data/utils'

function StatCard({ label, value, tone }) {
  const toneClass =
    tone === 'positive' ? 'text-positive' : tone === 'negative' ? 'text-negative' : 'text-text'
  return (
    <Card className="p-4 sm:p-5">
      <div className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</div>
      <div className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${toneClass}`}>{value}</div>
    </Card>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      {label && <div className="font-semibold mb-1">{label}</div>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color || p.payload.color }} />
          <span className="text-muted capitalize">{p.name}:</span>
          <span className="font-semibold">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const { transactions, recurring, categoryMap } = useBudget()
  const { income, expense, net } = monthlyTotals(transactions)
  const balance = totalBalance(transactions)
  const trend = monthlyTrend(transactions, 6)

  const spend = spendByCategory(transactions)
  const pieData = Object.entries(spend)
    .map(([catId, amount]) => ({
      name: categoryMap[catId]?.name || 'Other',
      color: categoryMap[catId]?.color || '#888',
      value: amount,
    }))
    .sort((a, b) => b.value - a.value)

  const upcoming = [...recurring]
    .map((r) => ({ ...r, inDays: daysUntil(r.nextDate) }))
    .sort((a, b) => a.inDays - b.inDays)
    .slice(0, 4)

  const recent = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Good to see you 👋</h1>
        <p className="text-muted mt-1">Here's where your money stands this month.</p>
      </div>

      {/* Balance hero */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="text-xs font-semibold text-muted uppercase tracking-wide">Total Balance</div>
        <div className="text-4xl sm:text-5xl font-extrabold mt-1.5">{formatCurrency(balance)}</div>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="text-positive font-semibold">↑ {formatCurrency(income)} in</span>
          <span className="text-negative font-semibold">↓ {formatCurrency(expense)} out</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Income (mo)" value={formatCurrency(income)} tone="positive" />
        <StatCard label="Spent (mo)" value={formatCurrency(expense)} tone="negative" />
        <StatCard label="Net (mo)" value={formatCurrency(net)} tone={net >= 0 ? 'positive' : 'negative'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Trend */}
        <Card className="p-4 sm:p-5">
          <h2 className="font-bold mb-4">Income vs. Spending</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgb(var(--surface-2))', opacity: 0.4 }} />
                <Bar dataKey="income" fill="rgb(var(--positive))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="rgb(var(--negative))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending by category */}
        <Card className="p-4 sm:p-5">
          <h2 className="font-bold mb-4">Spending by Category</h2>
          {pieData.length === 0 ? (
            <p className="text-sm text-muted py-12 text-center">No spending yet this month.</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={2} stroke="none">
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                {pieData.slice(0, 5).map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="truncate text-muted">{d.name}</span>
                    <span className="ml-auto font-semibold">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upcoming bills */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Upcoming Bills</h2>
            <button className="text-xs font-semibold text-primary" onClick={() => onNavigate('recurring')}>View all</button>
          </div>
          <div className="space-y-2.5">
            {upcoming.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg grid place-items-center text-sm" style={{ background: (categoryMap[r.categoryId]?.color || '#888') + '22' }}>
                  {categoryMap[r.categoryId]?.icon || '🔁'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{r.name}</div>
                  <div className="text-xs text-muted">
                    {r.inDays <= 0 ? 'Due now' : `in ${r.inDays} day${r.inDays === 1 ? '' : 's'}`}
                  </div>
                </div>
                <div className="ml-auto font-semibold text-sm">{formatCurrency(r.amount)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Recent Activity</h2>
            <button className="text-xs font-semibold text-primary" onClick={() => onNavigate('transactions')}>View all</button>
          </div>
          <div className="space-y-2.5">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg grid place-items-center text-sm" style={{ background: (categoryMap[t.categoryId]?.color || '#888') + '22' }}>
                  {categoryMap[t.categoryId]?.icon || '💳'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{t.desc}</div>
                  <div className="text-xs text-muted">{categoryMap[t.categoryId]?.name}</div>
                </div>
                <div className={`ml-auto font-semibold text-sm ${t.type === 'income' ? 'text-positive' : 'text-text'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
