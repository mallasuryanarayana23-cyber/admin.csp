import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Download, Eye, ClipboardCheck, Mic, Keyboard, Scan } from 'lucide-react'
import { assessmentService } from '../../services'
import { Badge, GlassCard, EmptyState, LoadingSpinner } from '../../components/ui'

const TYPE_ICON = {
  Reading: <ClipboardCheck size={16} />,
  Voice: <Mic size={16} />,
  Typing: <Keyboard size={16} />,
  'Eye Tracking': <Scan size={16} />,
}

const STATUS_BADGE = {
  completed: 'active',
  'in-progress': 'info',
  scheduled: 'onboarding',
  failed: 'inactive',
}

const RISK_COLOR = {
  low: '#10B981',
  moderate: '#f59e0b',
  high: '#ba1a1a',
}

export function AssessmentsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentService.getAll,
  })

  const filtered = (data ?? []).filter((a) => {
    const matchSearch =
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0b1c30' }}>Assessments</h2>
          <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
            Manage, monitor and analyze all learning assessments.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          New Assessment
        </button>
      </div>

      {/* Assessment Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: 'Reading', icon: <ClipboardCheck size={28} color="#3525cd" />, count: 3 },
          { type: 'Voice', icon: <Mic size={28} color="#00687a" />, count: 2 },
          { type: 'Typing', icon: <Keyboard size={28} color="#10B981" />, count: 1 },
          { type: 'Eye Tracking', icon: <Scan size={28} color="#ba1a1a" />, count: 1 },
        ].map((t, i) => (
          <motion.button
            key={t.type}
            onClick={() => setTypeFilter(typeFilter === t.type ? 'all' : t.type)}
            className="glass-card rounded-2xl p-5 text-left transition-all"
            style={{
              border: typeFilter === t.type ? '2px solid #3525cd' : '1px solid rgba(199,196,216,0.4)',
              cursor: 'pointer',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -2 }}
          >
            <div className="mb-3">{t.icon}</div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{t.type}</p>
            <p style={{ fontSize: 14, color: '#464555' }}>{t.count} Active</p>
          </motion.button>
        ))}
      </div>

      {/* Filters Bar */}
      <GlassCard style={{ padding: '12px 20px' }}>
        <div className="flex flex-wrap gap-3 items-center">
          <div
            className="flex items-center gap-2 flex-1"
            style={{ minWidth: 240, background: '#eff4ff', borderRadius: 9999, padding: '6px 16px' }}
          >
            <Search size={16} color="#464555" />
            <input
              type="text"
              placeholder="Search by student or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, width: '100%' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} color="#464555" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: '1px solid #c7c4d8', borderRadius: 8, padding: '6px 12px', fontSize: 14, background: '#fff', outline: 'none' }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <button className="btn-ghost flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </GlassCard>

      {/* Assessments Table */}
      <GlassCard style={{ overflow: 'hidden', border: '1px solid rgba(199,196,216,0.3)' }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck size={28} color="#3525cd" />}
            title="No assessments found"
            description="Try adjusting your filters or create a new assessment."
            action={<button className="btn-primary"><Plus size={16} /> New Assessment</button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#eff4ff' }}>
                {['ID', 'Student', 'Type', 'Status', 'Score', 'Risk', 'Date', ''].map((h) => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#464555' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  style={{ borderBottom: '1px solid rgba(199,196,216,0.15)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td style={{ padding: '16px 20px', fontSize: 13, fontFamily: 'monospace', color: '#464555' }}>{a.id}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 600 }}>{a.student}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className="flex items-center gap-2" style={{ fontSize: 14 }}>
                      {TYPE_ICON[a.type]}
                      {a.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <Badge variant={STATUS_BADGE[a.status] || 'info'}>
                      {a.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                    {a.score !== null ? `${a.score}/100` : '—'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {a.risk ? (
                      <span
                        className="flex items-center gap-1.5"
                        style={{ color: RISK_COLOR[a.risk], fontWeight: 600, fontSize: 14 }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ background: RISK_COLOR[a.risk] }} />
                        {a.risk.charAt(0).toUpperCase() + a.risk.slice(1)}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 14, color: '#464555' }}>{a.date}</td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      style={{ color: '#3525cd', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500 }}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
