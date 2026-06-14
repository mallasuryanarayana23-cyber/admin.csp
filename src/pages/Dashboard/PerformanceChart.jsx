import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { usePerformanceDistribution } from '../../hooks/useDashboard'
import { GlassCard, LoadingSpinner } from '../../components/ui'

const COLORS = { mastery: '#3525cd', progressing: '#00687a', atRisk: '#ba1a1a' }

export function PerformanceChart() {
  const { data, isLoading } = usePerformanceDistribution()

  return (
    <GlassCard style={{ padding: 24, flex: 2 }}>
      <div className="flex justify-between items-center mb-6">
        <h3 style={{ fontSize: 20, fontWeight: 600 }}>Performance Distribution</h3>
        <div className="flex gap-4">
          {Object.entries(COLORS).map(([key, color]) => (
            <span key={key} className="flex items-center gap-1.5" style={{ fontSize: 12 }}>
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
              />
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </span>
          ))}
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} barSize={22} barCategoryGap="30%">
            <XAxis
              dataKey="grade"
              tick={{ fontSize: 12, fill: '#464555' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(199,196,216,0.4)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="mastery" stackId="a" fill={COLORS.mastery} radius={[4, 4, 0, 0]} />
            <Bar dataKey="progressing" stackId="a" fill={COLORS.progressing} />
            <Bar dataKey="atRisk" stackId="a" fill={COLORS.atRisk} radius={[0, 0, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  )
}
