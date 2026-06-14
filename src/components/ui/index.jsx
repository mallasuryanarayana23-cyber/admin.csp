/* eslint-disable react-refresh/only-export-components */
// ─────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────

export function StatCard({ icon, trend, trendColor, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(79,70,229,0.12)' }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="flex items-center gap-1 text-xs font-bold"
            style={{ color: trendColor || '#10B981' }}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-6">
        {sub && <p style={{ fontSize: 14, color: '#464555', fontWeight: 500 }}>{sub}</p>}
        {label && <p style={{ fontSize: 14, color: '#464555', fontWeight: 500 }}>{label}</p>}
        <p className="font-bold mt-1" style={{ fontSize: 24, lineHeight: '32px' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function Badge({ variant = 'active', children }) {
  const styles = {
    active: { background: 'rgba(16,185,129,0.1)', color: '#10B981' },
    onboarding: { background: '#d3e4fe', color: '#464555' },
    inactive: { background: '#ffdad6', color: '#ba1a1a' },
    warning: { background: 'rgba(186,26,26,0.1)', color: '#ba1a1a' },
    info: { background: 'rgba(53,37,205,0.1)', color: '#3525cd' },
  }
  return (
    <span className="badge" style={styles[variant] || styles.active}>
      {children}
    </span>
  )
}

export function ProgressBar({ value, color = '#3525cd', label }) {
  return (
    <div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      {label && (
        <p className="text-xs mt-1" style={{ color: '#464555' }}>
          {label}
        </p>
      )}
    </div>
  )
}

export function SectionHeader({ title, description, actions }) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 style={{ fontSize: 32, fontWeight: 700, lineHeight: '40px', letterSpacing: '-0.01em', color: '#0b1c30' }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  )
}

export function LoadingSpinner({ size = 32 }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid #e5eeff',
          borderTop: '3px solid #3525cd',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: '#e5eeff' }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#464555', maxWidth: 320 }}>{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: '#ffdad6' }}
      >
        <span style={{ fontSize: 28 }}>⚠️</span>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#ba1a1a' }}>Error</h3>
      <p style={{ fontSize: 14, color: '#464555', maxWidth: 320 }}>{message}</p>
      {onRetry && (
        <button className="btn-primary mt-6" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

export function GlassCard({ children, className = '', style = {} }) {
  return (
    <div className={`glass-card rounded-2xl shadow-sm ${className}`} style={style}>
      {children}
    </div>
  )
}

export * from './ToastProvider'
export * from './AppStateProvider'
export * from './ErrorBoundary'
