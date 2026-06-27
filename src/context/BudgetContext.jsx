import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage, uid } from '../data/storage'
import { buildSeed } from '../data/seed'

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [recurring, setRecurring] = useState([])
  const [ready, setReady] = useState(false)

  // Load everything once. Seed sample data on first ever run.
  useEffect(() => {
    async function load() {
      const seeded = await storage.getSetting('seeded', false)
      if (!seeded) {
        const s = buildSeed()
        await storage.setCollection('categories', s.categories)
        await storage.setCollection('transactions', s.transactions)
        await storage.setCollection('budgets', s.budgets)
        await storage.setCollection('recurring', s.recurring)
        await storage.setSetting('seeded', true)
        setCategories(s.categories)
        setTransactions(s.transactions)
        setBudgets(s.budgets)
        setRecurring(s.recurring)
      } else {
        setCategories(await storage.getCollection('categories'))
        setTransactions(await storage.getCollection('transactions'))
        setBudgets(await storage.getCollection('budgets'))
        setRecurring(await storage.getCollection('recurring'))
      }
      setReady(true)
    }
    load()
  }, [])

  // Persist helpers — each mutation writes through to storage.
  const persist = (name, value, setter) => {
    setter(value)
    storage.setCollection(name, value)
  }

  // ---- Transactions ----
  const addTransaction = (t) => {
    const next = [{ ...t, id: uid() }, ...transactions]
    persist('transactions', next, setTransactions)
  }
  const updateTransaction = (id, patch) => {
    const next = transactions.map((t) => (t.id === id ? { ...t, ...patch } : t))
    persist('transactions', next, setTransactions)
  }
  const deleteTransaction = (id) => {
    persist('transactions', transactions.filter((t) => t.id !== id), setTransactions)
  }

  // ---- Categories ----
  const addCategory = (c) => {
    const next = [...categories, { ...c, id: uid() }]
    persist('categories', next, setCategories)
  }
  const updateCategory = (id, patch) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...patch } : c))
    persist('categories', next, setCategories)
  }
  const deleteCategory = (id) => {
    persist('categories', categories.filter((c) => c.id !== id), setCategories)
  }

  // ---- Budgets ----
  const upsertBudget = (categoryId, limit) => {
    const existing = budgets.find((b) => b.categoryId === categoryId)
    let next
    if (existing) {
      next = budgets.map((b) => (b.categoryId === categoryId ? { ...b, limit } : b))
    } else {
      next = [...budgets, { id: uid(), categoryId, limit }]
    }
    persist('budgets', next, setBudgets)
  }
  const deleteBudget = (id) => {
    persist('budgets', budgets.filter((b) => b.id !== id), setBudgets)
  }

  // ---- Recurring ----
  const addRecurring = (r) => {
    persist('recurring', [...recurring, { ...r, id: uid() }], setRecurring)
  }
  const updateRecurring = (id, patch) => {
    const next = recurring.map((r) => (r.id === id ? { ...r, ...patch } : r))
    persist('recurring', next, setRecurring)
  }
  const deleteRecurring = (id) => {
    persist('recurring', recurring.filter((r) => r.id !== id), setRecurring)
  }

  const resetAll = async () => {
    const s = buildSeed()
    await storage.setCollection('categories', s.categories)
    await storage.setCollection('transactions', s.transactions)
    await storage.setCollection('budgets', s.budgets)
    await storage.setCollection('recurring', s.recurring)
    setCategories(s.categories)
    setTransactions(s.transactions)
    setBudgets(s.budgets)
    setRecurring(s.recurring)
  }

  const clearAll = async () => {
    await storage.setCollection('transactions', [])
    await storage.setCollection('budgets', [])
    await storage.setCollection('recurring', [])
    setTransactions([])
    setBudgets([])
    setRecurring([])
  }

  // Category lookup map for fast joins in views.
  const categoryMap = useMemo(() => {
    const m = {}
    categories.forEach((c) => (m[c.id] = c))
    return m
  }, [categories])

  const value = {
    ready,
    categories, transactions, budgets, recurring, categoryMap,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, updateCategory, deleteCategory,
    upsertBudget, deleteBudget,
    addRecurring, updateRecurring, deleteRecurring,
    resetAll, clearAll,
  }
  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget() {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider')
  return ctx
}
