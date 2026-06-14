import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X, Activity } from 'lucide-react'

const REALTIME_EVENTS = [
  {
    id: 1,
    color: '#10B981',
    label: '142 Screenings In-Progress',
    sub: null,
    progress: 45,
    pulse: true,
  },
  {
    id: 2,
    color: '#3525cd',
    label: 'New Teacher Signup: Washington JH',
    sub: '2 minutes ago',
    progress: null,
    pulse: false,
  },
  {
    id: 3,
    color: '#ba1a1a',
    label: 'Risk Alert: Grade 4 (Sector B)',
    sub: '15 minutes ago',
    progress: null,
    pulse: false,
  },
]

export function InsightsPanel() {
  const [isOpen, setIsOpen] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 group"
        style={{ background: '#3525cd', color: '#fff', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        id="insightsTrigger"
        aria-label="Quick Stats"
      >
        <Lightbulb size={22} />
        <span
          className="absolute pointer-events-none whitespace-nowrap rounded px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            right: '4rem',
            background: '#0b1c30',
            color: '#f8f9ff',
            fontSize: 12,
          }}
        >
          Quick Stats
        </span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-8 w-80 glass-card rounded-2xl shadow-2xl p-6 z-50"
            id="insightsPanel"
          >
            {/* Header */}
            <div
              className="flex justify-between items-center mb-4 pb-3"
              style={{ borderBottom: '1px solid rgba(199,196,216,0.4)' }}
            >
              <h4 style={{ fontSize: 16, fontWeight: 600 }}>Real-time Activity</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="transition-colors"
                style={{ color: '#464555' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ba1a1a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#464555')}
                id="closeInsights"
              >
                <X size={18} />
              </button>
            </div>

            {/* Events */}
            <div className="space-y-4">
              {REALTIME_EVENTS.map((evt) => (
                <div key={evt.id} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{
                      background: evt.color,
                      animation: evt.pulse ? 'pulse 2s infinite' : 'none',
                    }}
                  />
                  <div className="flex-1">
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{evt.label}</p>
                    {evt.progress !== null && (
                      <div className="progress-bar mt-1.5">
                        <div
                          className="progress-fill"
                          style={{ width: `${evt.progress}%`, background: evt.color }}
                        />
                      </div>
                    )}
                    {evt.sub && (
                      <p style={{ fontSize: 10, color: '#464555', marginTop: 2 }}>{evt.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className="w-full mt-6 py-2 rounded-lg transition-all"
              style={{
                background: '#dce9ff',
                color: '#3525cd',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3525cd'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dce9ff'
                e.currentTarget.style.color = '#3525cd'
              }}
            >
              View Full Log
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
