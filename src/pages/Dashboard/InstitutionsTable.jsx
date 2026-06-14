import { useState } from 'react'
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import { useInstitutions } from '../../hooks/useDashboard'
import { Badge, ProgressBar, GlassCard, LoadingSpinner, ErrorState } from '../../components/ui'

const INITIAL_COLOR = {
  L: { bg: 'rgba(53,37,205,0.12)', color: '#3525cd' },
  W: { bg: 'rgba(0,104,122,0.12)', color: '#00687a' },
  S: { bg: 'rgba(186,26,26,0.12)', color: '#ba1a1a' },
  R: { bg: 'rgba(53,37,205,0.12)', color: '#3525cd' },
  J: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
}

const RISK_COLOR = {
  low: '#10B981',
  moderate: '#f59e0b',
  critical: '#ba1a1a',
  na: '#777587',
}

const PAGE_SIZE = 3

export function InstitutionsTable() {
  const { data, isLoading, isError, refetch } = useInstitutions()
  const [page, setPage] = useState(1)
  const [district, setDistrict] = useState('all')

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={refetch} />

  const total = data?.length ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paged = data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? []

  return (
    <GlassCard style={{ overflow: 'hidden', border: '1px solid rgba(199,196,216,0.3)' }}>
      {/* Table Header Controls */}
      <div
        className="p-6 flex justify-between items-center"
        style={{ borderBottom: '1px solid rgba(199,196,216,0.2)' }}
      >
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 600 }}>Institutional Overview</h3>
          <p style={{ fontSize: 14, color: '#464555', marginTop: 2 }}>
            Manage and monitor school-level performance metrics.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="rounded-lg px-3 py-2"
            style={{
              border: '1px solid #777587',
              fontSize: 14,
              background: '#fff',
              color: '#0b1c30',
              outline: 'none',
            }}
          >
            <option value="all">All Districts</option>
            <option value="north">North Region</option>
            <option value="south">South Region</option>
          </select>
          <button className="btn-ghost">Manage Credentials</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eff4ff' }}>
              {['Institution', 'Status', 'Engagement', 'Risk Factor', 'Last Screening', ''].map(
                (h) => (
                  <th
                    key={h}
                    className="table-header"
                    style={{ textAlign: h === '' ? 'right' : 'left' }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paged.map((inst) => {
              const ic = INITIAL_COLOR[inst.initial] || INITIAL_COLOR.L
              return (
                <tr key={inst.id} className="table-row">
                  {/* Institution */}
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold"
                        style={{ background: ic.bg, color: ic.color, fontSize: 16 }}
                      >
                        {inst.initial}
                      </div>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 600 }}>{inst.name}</p>
                        <p style={{ fontSize: 12, color: '#464555' }}>
                          {inst.students.toLocaleString()} Students · {inst.teachers} Teachers
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="table-cell">
                    <Badge variant={inst.status}>
                      {inst.status.toUpperCase()}
                    </Badge>
                  </td>

                  {/* Engagement */}
                  <td className="table-cell" style={{ minWidth: 160 }}>
                    {inst.status === 'onboarding' ? (
                      <div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${inst.engagement}%` }}
                          />
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#464555' }}>Pending Sync</p>
                      </div>
                    ) : (
                      <ProgressBar
                        value={inst.engagement}
                        label={`${inst.engagement}% Completion`}
                      />
                    )}
                  </td>

                  {/* Risk Factor */}
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: RISK_COLOR[inst.riskLevel] }}
                      />
                      <span style={{ fontSize: 16 }}>{inst.riskFactor}</span>
                    </div>
                  </td>

                  {/* Last Screening */}
                  <td className="table-cell" style={{ fontSize: 16, color: '#464555' }}>
                    {inst.lastScreening}
                  </td>

                  {/* Actions */}
                  <td className="table-cell" style={{ textAlign: 'right' }}>
                    <button
                      style={{ color: '#464555', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#3525cd')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#464555')}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="px-6 py-3 flex justify-between items-center"
        style={{
          borderTop: '1px solid rgba(199,196,216,0.2)',
          background: '#ffffff',
        }}
      >
        <p style={{ fontSize: 12, color: '#464555' }}>
          Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} institutions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded"
            style={{
              border: '1px solid #777587',
              background: 'transparent',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{
                background: p === page ? '#3525cd' : 'transparent',
                color: p === page ? '#fff' : '#0b1c30',
                border: p === page ? 'none' : '1px solid #777587',
                fontWeight: p === page ? 700 : 400,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded"
            style={{
              border: '1px solid #777587',
              background: 'transparent',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
