// First-run sample data so the app looks alive before the user adds
// anything. Cleared the moment they reset or add their own records.
import { uid } from './storage'

export const defaultCategories = [
  { id: uid(), name: 'Income', type: 'income', color: '#34d399', icon: '💰' },
  { id: uid(), name: 'Housing', type: 'expense', color: '#60a5fa', icon: '🏠' },
  { id: uid(), name: 'Groceries', type: 'expense', color: '#fbbf24', icon: '🛒' },
  { id: uid(), name: 'Dining', type: 'expense', color: '#f87171', icon: '🍽️' },
  { id: uid(), name: 'Transport', type: 'expense', color: '#a78bfa', icon: '🚗' },
  { id: uid(), name: 'Utilities', type: 'expense', color: '#22d3ee', icon: '💡' },
  { id: uid(), name: 'Entertainment', type: 'expense', color: '#f472b6', icon: '🎬' },
  { id: uid(), name: 'Health', type: 'expense', color: '#4ade80', icon: '💊' },
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function buildSeed() {
  const cats = defaultCategories
  const byName = (n) => cats.find((c) => c.name === n).id

  const transactions = [
    { id: uid(), date: daysAgo(28), desc: 'Paycheck', amount: 3200, categoryId: byName('Income'), type: 'income' },
    { id: uid(), date: daysAgo(26), desc: 'Rent', amount: 1450, categoryId: byName('Housing'), type: 'expense' },
    { id: uid(), date: daysAgo(24), desc: 'Whole Foods', amount: 96.4, categoryId: byName('Groceries'), type: 'expense' },
    { id: uid(), date: daysAgo(20), desc: 'Electric bill', amount: 82.15, categoryId: byName('Utilities'), type: 'expense' },
    { id: uid(), date: daysAgo(18), desc: 'Dinner out', amount: 54.2, categoryId: byName('Dining'), type: 'expense' },
    { id: uid(), date: daysAgo(15), desc: 'Gas', amount: 48.9, categoryId: byName('Transport'), type: 'expense' },
    { id: uid(), date: daysAgo(12), desc: 'Movie night', amount: 32, categoryId: byName('Entertainment'), type: 'expense' },
    { id: uid(), date: daysAgo(14), desc: 'Paycheck', amount: 3200, categoryId: byName('Income'), type: 'income' },
    { id: uid(), date: daysAgo(9), desc: 'Trader Joe\'s', amount: 71.3, categoryId: byName('Groceries'), type: 'expense' },
    { id: uid(), date: daysAgo(6), desc: 'Pharmacy', amount: 23.5, categoryId: byName('Health'), type: 'expense' },
    { id: uid(), date: daysAgo(4), desc: 'Coffee + lunch', amount: 28.75, categoryId: byName('Dining'), type: 'expense' },
    { id: uid(), date: daysAgo(2), desc: 'Rideshare', amount: 19.4, categoryId: byName('Transport'), type: 'expense' },
  ]

  const budgets = [
    { id: uid(), categoryId: byName('Groceries'), limit: 500 },
    { id: uid(), categoryId: byName('Dining'), limit: 200 },
    { id: uid(), categoryId: byName('Transport'), limit: 150 },
    { id: uid(), categoryId: byName('Entertainment'), limit: 120 },
    { id: uid(), categoryId: byName('Utilities'), limit: 250 },
  ]

  const recurring = [
    { id: uid(), name: 'Netflix', amount: 15.49, categoryId: byName('Entertainment'), cycle: 'monthly', nextDate: daysAgo(-3) },
    { id: uid(), name: 'Spotify', amount: 11.99, categoryId: byName('Entertainment'), cycle: 'monthly', nextDate: daysAgo(-9) },
    { id: uid(), name: 'Gym', amount: 39, categoryId: byName('Health'), cycle: 'monthly', nextDate: daysAgo(-1) },
    { id: uid(), name: 'Rent', amount: 1450, categoryId: byName('Housing'), cycle: 'monthly', nextDate: daysAgo(-5) },
    { id: uid(), name: 'Internet', amount: 65, categoryId: byName('Utilities'), cycle: 'monthly', nextDate: daysAgo(-12) },
  ]

  return { categories: cats, transactions, budgets, recurring }
}
