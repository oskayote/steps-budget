import { useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { Card, Button, Input, Select, Label, Modal, IconButton, EmptyState, Pill } from '../components/ui'
import { formatCurrency, daysUntil } from '../data/utils'

const today = () => new Date().toISOString().slice(0, 10)

function RecForm({ categories, initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: '', amount: '', cycle: 'monthly', nextDate: today(), categoryId: categories[1]?.id || categories[0]?.id },
  )
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.amount) return
    onSave({ ...form, amount: parseFloat(form.amount) })
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={form.name} onChange={set('name')} placeholder="e.g. Netflix" autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" value={form.amount} onChange={set('amount')} placeholder="0.00" />
        </div>
        <div>
          <Label>Cycle</Label>
          <Select value={form.cycle} onChange={set('cycle')}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Next Date</Label>
          <Input type="date" value={form.nextDate} onChange={set('nextDate')} />
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

export default function Recurring() {
  const { recurring, categories, categoryMap, addRecurring, updateRecurring, deleteRecurring } = useBudget()
  const [modal, setModal] = useState(null)

  const sorted = [...recurring]
    .map((r) => ({ ...r, inDays: daysUntil(r.nextDate) }))
    .sort((a, b) => a.inDays - b.inDays)

  const monthlyTotal = recurring.reduce((s, r) => {
    const factor = r.cycle === 'weekly' ? 4.33 : r.cycle === 'yearly' ? 1 / 12 : 1
    return s + r.amount * factor
  }, 0)

  const save = (data) => {
    if (modal && modal !== 'new') updateRecurring(modal.id, data)
    else addRecurring(data)
    setModal(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Recurring</h1>
          <p className="text-muted mt-1">Subscriptions & bills</p>
        </div>
        <Button onClick={() => setModal('new')}>＋ Add</Button>
      </div>

      <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="text-xs font-semibold text-muted uppercase tracking-wide">Est. Monthly Cost</div>
        <div className="text-3xl font-extrabold mt-1">{formatCurrency(monthlyTotal)}</div>
        <div className="text-sm text-muted mt-1">{recurring.length} active recurring items</div>
      </Card>

      {sorted.length === 0 ? (
        <Card><EmptyState icon="🔁" title="No recurring items" hint="Track subscriptions and bills here." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {sorted.map((r) => {
            const cat = categoryMap[r.categoryId]
            const due = r.inDays <= 0
            const soon = r.inDays > 0 && r.inDays <= 5
            return (
              <div key={r.id} className="flex items-center gap-3 p-3.5 group">
                <div className="w-10 h-10 rounded-xl grid place-items-center text-base shrink-0" style={{ background: (cat?.color || '#888') + '22' }}>
                  {cat?.icon || '🔁'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{r.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted capitalize">{r.cycle}</span>
                    {due && <Pill color="#f87171">Due now</Pill>}
                    {soon && <Pill color="#fbbf24">in {r.inDays}d</Pill>}
                  </div>
                </div>
                <div className="font-bold shrink-0">{formatCurrency(r.amount)}</div>
                <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <IconButton onClick={() => setModal(r)} aria-label="Edit">✏️</IconButton>
                  <IconButton onClick={() => deleteRecurring(r.id)} aria-label="Delete">🗑️</IconButton>
                </div>
              </div>
            )
          })}
        </Card>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal && modal !== 'new' ? 'Edit Recurring' : 'New Recurring'}>
        <RecForm
          categories={categories}
          initial={modal && modal !== 'new' ? modal : null}
          onSave={save}
          onCancel={() => setModal(null)}
        />
      </Modal>
    </div>
  )
}
