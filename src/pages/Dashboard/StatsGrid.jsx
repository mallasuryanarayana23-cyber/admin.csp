import { motion } from 'framer-motion'
import { TrendingUp, Users, AlertTriangle, CheckCircle2, School } from 'lucide-react'
import { useDashboardStats } from '../../hooks/useDashboard'
import { LoadingSpinner } from '../../components/ui'

const STAT_CONFIG = [
  {
    key: 'students',
    icon: <Users size={22} color="#3525cd" />,
    iconBg: 'rgba(53,37,205,0.12)',
    label: 'Total Active Students',
    valueKey: 'totalStudents',
    trendKey: 'studentsTrend',
    trendColor: '#10B981',
  },
  {
    key: 'risk',
    icon: <AlertTriangle size={22} color="#ba1a1a" />,
    iconBg: 'rgba(186,26,26,0.1)',
    label: 'Risk Prevalence',
    valueKey: 'riskPrevalence',
    valueSuffix: '%',
    trendKey: 'riskTrend',
    trendColor: '#ba1a1a',
  },
  {
    key: 'screenings',
    icon: <CheckCircle2 size={22} color="#10B981" />,
    iconBg: 'rgba(16,185,129,0.1)',
    label: 'Completed Screenings',
    valueKey: 'completedScreenings',
    trendKey: 'screeningsTrend',
    trendColor: '#10B981',
  },
  {
    key: 'institutions',
    icon: <School size={22} color="#3525cd" />,
    iconBg: 'rgba(53,37,205,0.12)',
    label: 'Active Institutions',
    valueKey: 'activeInstitutions',
    sub: 'Regional Focus',
    trendColor: '#464555',
  },
]

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {STAT_CONFIG.map((cfg, i) => {
        const value = data?.[cfg.valueKey]
        const trend = data?.[cfg.trendKey]
        return (
          <motion.div
            key={cfg.key}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-xl" style={{ background: cfg.iconBg }}>
                {cfg.icon}
              </div>
              {trend ? (
                <span
                  className="flex items-center gap-1 font-bold"
                  style={{ fontSize: 12, color: cfg.trendColor }}
                >
                  {trend} <TrendingUp size={12} />
                </span>
              ) : cfg.sub ? (
                <span style={{ fontSize: 12, color: '#464555', fontStyle: 'italic' }}>
                  {cfg.sub}
                </span>
              ) : null}
            </div>
            <div className="mt-6">
              <p style={{ fontSize: 14, color: '#464555', fontWeight: 500 }}>{cfg.label}</p>
              <p
                className="font-bold mt-1"
                style={{
                  fontSize: 24,
                  color: cfg.key === 'risk' ? '#ba1a1a' : '#0b1c30',
                }}
              >
                {typeof value === 'number'
                  ? value.toLocaleString() + (cfg.valueSuffix || '')
                  : value}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
