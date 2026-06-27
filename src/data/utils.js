// Shared formatting + computation helpers.

export function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2,
  }).format(n || 0)
}

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function monthKey(iso) {
  return iso.slice(0, 7) // YYYY-MM
}

export function currentMonthKey() {
  return new Date().toISOString().slice(0, 7)
}

// Totals for the current calendar month.
export function monthlyTotals(transactions) {
  const mk = currentMonthKey()
  let income = 0, expense = 0
  transactions.forEach((t) => {
    if (monthKey(t.date) !== mk) return
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  })
  return { income, expense, net: income - expense }
}

// Spend-per-category for the current month (expenses only).
export function spendByCategory(transactions) {
  const mk = currentMonthKey()
  const map = {}
  transactions.forEach((t) => {
    if (t.type !== 'expense' || monthKey(t.date) !== mk) return
    map[t.categoryId] = (map[t.categoryId] || 0) + t.amount
  })
  return map
}

// Net balance across all time.
export function totalBalance(transactions) {
  return transactions.reduce(
    (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
    0,
  )
}

// Last N months of income vs expense for the dashboard chart.
export function monthlyTrend(transactions, months = 6) {
  const now = new Date()
  const buckets = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toISOString().slice(0, 7)
    buckets.push({
      key,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      income: 0,
      expense: 0,
    })
  }
  const idx = Object.fromEntries(buckets.map((b, i) => [b.key, i]))
  transactions.forEach((t) => {
    const k = monthKey(t.date)
    if (k in idx) {
      const b = buckets[idx[k]]
      if (t.type === 'income') b.income += t.amount
      else b.expense += t.amount
    }
  })
  return buckets
}

export function daysUntil(iso) {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((d - today) / 86400000)
}
