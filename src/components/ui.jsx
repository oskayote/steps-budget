// Small set of reusable, theme-aware UI primitives.

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50'
  const variants = {
    primary: 'bg-primary text-primary-fg hover:opacity-90',
    soft: 'bg-surface-2 text-text hover:bg-border',
    ghost: 'text-muted hover:text-text hover:bg-surface-2',
    danger: 'bg-negative text-white hover:opacity-90',
  }
  const sizes = 'px-4 py-2.5 text-sm'
  return (
    <button className={`${base} ${variants[variant]} ${sizes} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...props}
    />
  )
}

export function Select({ className = '', children, ...props }) {
  return (
    <select
      className={`w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Label({ children }) {
  return <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">{children}</label>
}

export function Pill({ children, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: (color || '#888') + '22', color: color || 'rgb(var(--muted))' }}
    >
      {children}
    </span>
  )
}

export function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const over = value > max
  return (
    <div className="w-full h-2.5 rounded-full bg-surface-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          backgroundColor: over ? 'rgb(var(--negative))' : color || 'rgb(var(--primary))',
        }}
      />
    </div>
  )
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-surface border border-border rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <IconButton onClick={onClose} aria-label="Close">✕</IconButton>
        </div>
        {children}
      </div>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, hint }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-text">{title}</p>
      {hint && <p className="text-sm text-muted mt-1">{hint}</p>}
    </div>
  )
}
