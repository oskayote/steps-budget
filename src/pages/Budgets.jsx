import { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { Card, Button, Input, Select, Label, Modal, ProgressBar, EmptyState } from '../components/ui'
import { formatCurrency, spendByCategory } from '../data/utils'

export default function Budgets() {
  const { budgets, categories, categoryMap, transactions, upsertBudget, deleteBudget } = useBudget()
  const [modal, setModal] = useState(false)
  const [catId, setCatId] = useState('')
  const [limit, setLimit] = useState('')

  const spend = spendByCategory(transactions)
  const expenseCats = categories.filter((c) => c.type === 'expense')
  const available = expenseCats.filter((c) => !budgets.find((b) => b.categoryId === c.id))

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + (spend[b.categoryId] || 0), 0)

  const openNew = () => {
    setCatId(available[0]?.id || '')
    setLimit('')
    setModal(true)
  }
  const save = (e) => {
    e.preventDefault()
    if (!catId || !limit) return
    upsertBudget(catId, parseFloat(limit))
    setModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Budgets</h1>
          <p className="text-muted mt-1">Monthly spending limits</p>
        </div>
        <Button onClick={openNew} disabled={available.length === 0}>＋ Add</Button>
      </div>

      {/* Overall */}
      <Card className="p-5">
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wide">Total Budgeted</div>
            <div className="text-2xl font-extrabold mt-1">{formatCurrency(totalSpent)} <span className="text-muted text-lg font-semibold">/ {formatCurrency(totalLimit)}</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-muted uppercase tracking-wide">Remaining</div>
            <div className={`text-xl font-bold mt-1 ${totalLimit - totalSpent >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatCurrency(totalLimit - totalSpent)}
            </div>
          </div>
        </div>
        <ProgressBar value={totalSpent} max={totalLimit} />
      </Card>

      {budgets.length === 0 ? (
        <Card><EmptyState icon="🎯" title="No budgets yet" hint="Set a monthly limit for a category." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {budgets.map((b) => {
            const cat = categoryMap[b.categoryId]
            const spent = spend[b.categoryId] || 0
            const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0
            const over = spent > b.limit
            return (
              <Card key={b.id} className="p-4 sm:p-5 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl grid place-items-center text-base" style={{ background: (cat?.color || '#888') + '22' }}>
                    {cat?.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate">{cat?.name}</div>
                    <div className="text-xs text-muted">{Math.round(pct)}% used</div>
                  </div>
                  <button
                    onClick={() => deleteBudget(b.id)}
                    className="text-muted hover:text-negative opacity-0 group-hover:opacity-100 transition text-sm"
                    aria-label="Remove budget"
                  >🗑️</button>
                </div>
                <ProgressBar value={spent} max={b.limit} color={cat?.color} />
                <div className="flex justify-between mt-2.5 text-sm">
                  <span className={over ? 'text-negative font-semibold' : 'text-muted'}>
                    {formatCurrency(spent)} spent
                  </span>
                  <span className="font-semibold">{formatCurrency(b.limit)}</span>
                </div>
                {over && <div className="text-xs text-negative font-semibold mt-1.5">Over by {formatCurrency(spent - b.limit)}</div>}
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Budget">
        <form onSubmit={save} className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={catId} onChange={(e) => setCatId(e.target.value)}>
              {available.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Monthly Limit</Label>
            <Input type="number" step="0.01" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="0.00" autoFocus />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">Save</Button>
            <Button type="button" variant="soft" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
