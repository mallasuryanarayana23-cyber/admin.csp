import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useRiskTypology } from '../../hooks/useDashboard'
import { GlassCard, LoadingSpinner } from '../../components/ui'

export function RiskTypologyCard() {
  const { data, isLoading } = useRiskTypology()

  const total = data?.reduce((sum, d) => sum + d.value, 0) ?? 0

  return (
    <GlassCard style={{ padding: 24 }}>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Risk Typology</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Donut chart */}
          <div className="relative flex items-center justify-center" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(199,196,216,0.4)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <p className="font-bold" style={{ fontSize: 24 }}>
                2,309
              </p>
              <p
                className="uppercase tracking-wider"
                style={{ fontSize: 10, color: '#464555', marginTop: 2 }}
              >
                Total Risk Cases
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3 mt-4">
            {data.map((d) => (
              <div key={d.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: d.color }}
                  />
                  <span style={{ fontSize: 16 }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </GlassCard>
  )
}
