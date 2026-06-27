import { useMemo, useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import {
  Card, Button, Input, Select, Label, Modal, IconButton, EmptyState, Pill,
} from '../components/ui'
import { formatCurrency, formatDate } from '../data/utils'

const today = () => new Date().toISOString().slice(0, 10)

function TxForm({ categories, initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { date: today(), desc: '', amount: '', type: 'expense', categoryId: categories[1]?.id || categories[0]?.id },
  )
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.desc.trim() || !form.amount) return
    onSave({ ...form, amount: parseFloat(form.amount) })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Description</Label>
        <Input value={form.desc} onChange={set('desc')} placeholder="e.g. Grocery run" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={form.type} onChange={set('type')}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={set('date')} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.categoryId} onChange={set('categoryId')}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Save</Button>
        <Button type="button" variant="soft" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

export default function Transactions() {
  const {
    transactions, categories, categoryMap,
    addTransaction, updateTransaction, deleteTransaction,
  } = useBudget()

  const [modal, setModal] = useState(null) // null | 'new' | tx object
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter !== 'all' && t.type !== filter) return false
      if (query && !t.desc.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [transactions, query, filter])

  // Group by date for a clean list.
  const groups = useMemo(() => {
    const m = {}
    filtered.forEach((t) => {
      ;(m[t.date] = m[t.date] || []).push(t)
    })
    return Object.entries(m).sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [filtered])

  const save = (data) => {
    if (modal && modal !== 'new') updateTransaction(modal.id, data)
    else addTransaction(data)
    setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Activity</h1>
          <p className="text-muted mt-1">{filtered.length} transactions</p>
        </div>
        <Button onClick={() => setModal('new')}>＋ Add</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions…" className="sm:max-w-xs" />
        <div className="flex gap-2">
          {['all', 'expense', 'income'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                filter === f ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted hover:text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <Card><EmptyState icon="🧾" title="No transactions" hint="Add your first one to get started." /></Card>
      ) : (
        <div className="space-y-4">
          {groups.map(([date, items]) => (
            <div key={date}>
              <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 px-1">{formatDate(date)}</div>
              <Card className="divide-y divide-border">
                {items.map((t) => {
                  const cat = categoryMap[t.categoryId]
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-3.5 group">
                      <div className="w-10 h-10 rounded-xl grid place-items-center text-base shrink-0" style={{ background: (cat?.color || '#888') + '22' }}>
                        {cat?.icon || '💳'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{t.desc}</div>
                        <div className="mt-0.5"><Pill color={cat?.color}>{cat?.name || 'Uncategorized'}</Pill></div>
                      </div>
                      <div className={`font-bold shrink-0 ${t.type === 'income' ? 'text-positive' : 'text-text'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </div>
                      <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <IconButton onClick={() => setModal(t)} aria-label="Edit">✏️</IconButton>
                        <IconButton onClick={() => deleteTransaction(t.id)} aria-label="Delete">🗑️</IconButton>
                      </div>
                    </div>
                  )
                })}
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal && modal !== 'new' ? 'Edit Transaction' : 'New Transaction'}>
        <TxForm
          categories={categories}
          initial={modal && modal !== 'new' ? modal : null}
          onSave={save}
          onCancel={() => setModal(null)}
        />
      </Modal>
    </div>
  )
}
