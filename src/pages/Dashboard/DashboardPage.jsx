import { useState } from 'react'
import { Calendar, FileText, FileSpreadsheet } from 'lucide-react'
import { StatsGrid } from './StatsGrid'
import { PerformanceChart } from './PerformanceChart'
import { RiskTypologyCard } from './RiskTypologyCard'
import { InstitutionsTable } from './InstitutionsTable'
import { useToast, useAppState } from '../../components/ui'

export function DashboardPage() {
  const [dateRange, setDateRange] = useState('30d')
  const { addToast } = useToast()
  const { institutions } = useAppState()

  const handleDateChange = (val) => {
    setDateRange(val)
    const ranges = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days',
      'ytd': 'Year to Date',
    }
    addToast(`Dashboard metrics filtered for ${ranges[val]}`, 'success')
  }

  const handleExportExcel = () => {
    addToast('Preparing Excel export...', 'info')
    
    // Create CSV content from institutions
    const headers = ['Institution', 'Students', 'Teachers', 'Status', 'Engagement', 'Risk Factor', 'Last Screening']
    const rows = institutions.map(i => [
      i.name,
      i.students,
      i.teachers,
      i.status,
      `${i.engagement}%`,
      i.riskFactor,
      i.lastScreening
    ])
    
    const csvContent = [headers.join(','), ...rows.map(r => r.map(val => `"${val}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `neurolearn_institutions_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      addToast('Excel report downloaded successfully!', 'success')
    }, 1000)
  }

  const handleExportPDF = () => {
    addToast('Opening print dialog for PDF export...', 'info')
    setTimeout(() => {
      window.print()
    }, 500)
  }

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
          <div className="relative inline-block">
            <select
              value={dateRange}
              onChange={(e) => handleDateChange(e.target.value)}
              className="btn-outline flex items-center gap-2 cursor-pointer appearance-none pr-10"
              style={{ paddingRight: '40px', background: '#fff' }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
            </select>
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
          </div>

          {/* Export buttons */}
          <div
            className="flex overflow-hidden"
            style={{ border: '1px solid #777587', borderRadius: 8 }}
          >
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 hover:bg-slate-50 transition-colors"
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
              onClick={handleExportPDF}
              className="px-4 py-2 hover:opacity-90 transition-opacity"
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
