import { Calendar, FileText, FileSpreadsheet } from 'lucide-react'
import { StatsGrid } from './StatsGrid'
import { PerformanceChart } from './PerformanceChart'
import { RiskTypologyCard } from './RiskTypologyCard'
import { InstitutionsTable } from './InstitutionsTable'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: '40px',
              letterSpacing: '-0.01em',
              color: '#0b1c30',
            }}
          >
            Advanced Analytics
          </h2>
          <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
            System-wide performance monitoring and risk distribution.
          </p>
        </div>

        <div className="flex gap-3">
          {/* Date Range */}
          <button className="btn-outline flex items-center gap-2">
            <Calendar size={18} />
            Last 30 Days
          </button>

          {/* Export buttons */}
          <div
            className="flex overflow-hidden"
            style={{ border: '1px solid #777587', borderRadius: 8 }}
          >
            <button
              className="px-4 py-2"
              style={{
                background: '#fff',
                borderRight: '1px solid #777587',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
            <button
              className="px-4 py-2"
              style={{
                background: '#3525cd',
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <StatsGrid />

      {/* Charts Row — 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <RiskTypologyCard />
        </div>
      </div>

      {/* Institutions Table */}
      <InstitutionsTable />
    </div>
  )
}
