import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FileText, Download, Share2, Clock, Plus, Filter, RefreshCw } from 'lucide-react'
import { reportsService } from '../../services'
import { GlassCard, Badge, LoadingSpinner, EmptyState } from '../../components/ui'

const TYPE_META = {
  district: { label: 'District', color: '#3525cd', bg: 'rgba(53,37,205,0.1)' },
  institution: { label: 'Institution', color: '#00687a', bg: 'rgba(0,104,122,0.1)' },
  student: { label: 'Student', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  state: { label: 'State', color: '#ba1a1a', bg: 'rgba(186,26,26,0.1)' },
}

export function ReportsPage() {
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsService.getAll,
  })

  const filtered = (data ?? []).filter((r) => filter === 'all' || r.type === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0b1c30' }}>Reports</h2>
          <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
            AI-generated reports with export, scheduling, and sharing.
          </p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Generate Report
        </button>
      </div>

      {/* Quick Generate Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(TYPE_META).map(([key, meta], i) => (
          <motion.button
            key={key}
            className="glass-card rounded-2xl p-5 text-left hover:shadow-md transition-all"
            style={{ border: '1px solid rgba(199,196,216,0.4)', cursor: 'pointer' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: meta.bg }}
            >
              <FileText size={20} color={meta.color} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{meta.label} Report</p>
            <p style={{ fontSize: 12, color: '#464555', marginTop: 2 }}>Generate instantly</p>
          </motion.button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'student', 'institution', 'district', 'state'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full transition-all"
            style={{
              background: filter === f ? '#3525cd' : '#e5eeff',
              color: filter === f ? '#fff' : '#464555',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <GlassCard style={{ overflow: 'hidden', border: '1px solid rgba(199,196,216,0.3)' }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} color="#3525cd" />}
            title="No reports yet"
            description="Generate your first report to see it here."
          />
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(199,196,216,0.15)' }}>
            {filtered.map((r, i) => {
              const meta = TYPE_META[r.type] || TYPE_META.institution
              return (
                <motion.div
                  key={r.id}
                  className="flex items-center justify-between p-6"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: meta.bg }}
                    >
                      <FileText size={22} color={meta.color} />
                    </div>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 600 }}>{r.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#464555' }}>
                          <Clock size={11} />
                          {r.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {r.status === 'generating' ? (
                      <span className="flex items-center gap-2 text-sm" style={{ color: '#464555' }}>
                        <RefreshCw size={14} className="animate-spin" />
                        Generating...
                      </span>
                    ) : (
                      <Badge variant="active">READY</Badge>
                    )}
                    <button className="btn-ghost flex items-center gap-1.5">
                      <Download size={15} />
                      PDF
                    </button>
                    <button className="btn-ghost flex items-center gap-1.5">
                      <Share2 size={15} />
                      Share
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
