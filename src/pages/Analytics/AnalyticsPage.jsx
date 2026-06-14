import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, LineChart, Line,
} from 'recharts'
import { analyticsService } from '../../services'
import { GlassCard, LoadingSpinner, SectionHeader } from '../../components/ui'
import { TrendingUp, Activity, MapPin, Users } from 'lucide-react'

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('trends')

  const { data: trends, isLoading: tLoading } = useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: analyticsService.getTrends,
  })

  const { data: regional, isLoading: rLoading } = useQuery({
    queryKey: ['analytics', 'regional'],
    queryFn: analyticsService.getRegionalData,
  })

  const TABS = [
    { id: 'trends', label: 'Risk Trends', icon: <TrendingUp size={16} /> },
    { id: 'regional', label: 'Regional', icon: <MapPin size={16} /> },
    { id: 'radar', label: 'AI Analysis', icon: <Activity size={16} /> },
  ]

  const radarData = [
    { subject: 'Phonological', A: 78 },
    { subject: 'Rapid Naming', A: 52 },
    { subject: 'Working Mem', A: 64 },
    { subject: 'Processing', A: 71 },
    { subject: 'Attention', A: 45 },
    { subject: 'Visual', A: 59 },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics Suite"
        description="Predictive insights and risk intelligence across your institution network."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Risk Score', value: '18.5%', icon: <Activity size={20} color="#ba1a1a" />, bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a' },
          { label: 'Intervention Rate', value: '73%', icon: <Users size={20} color="#10B981" />, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
          { label: 'Screening Velocity', value: '142/day', icon: <TrendingUp size={20} color="#3525cd" />, bg: 'rgba(53,37,205,0.12)', color: '#3525cd' },
          { label: 'AI Confidence', value: '91.4%', icon: <Activity size={20} color="#00687a" />, bg: 'rgba(0,104,122,0.12)', color: '#00687a' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="p-2.5 rounded-xl w-fit mb-4" style={{ background: kpi.bg }}>
              {kpi.icon}
            </div>
            <p style={{ fontSize: 14, color: '#464555', fontWeight: 500 }}>{kpi.label}</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: kpi.color, marginTop: 4 }}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Selector */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: '#e5eeff' }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              background: activeTab === t.id ? '#3525cd' : 'transparent',
              color: activeTab === t.id ? '#fff' : '#464555',
              fontWeight: activeTab === t.id ? 600 : 400,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      {activeTab === 'trends' && (
        <GlassCard style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
            Learning Disability Risk Trends (6-Month)
          </h3>
          {tLoading ? <LoadingSpinner /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <defs>
                  {[
                    ['dyslexia', '#3525cd'],
                    ['adhd', '#00687a'],
                    ['reading', '#10B981'],
                  ].map(([key, color]) => (
                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(199,196,216,0.4)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#464555' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#464555' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(199,196,216,0.4)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="dyslexia" stroke="#3525cd" fill="url(#grad-dyslexia)" strokeWidth={2} dot={false} name="Dyslexia" />
                <Area type="monotone" dataKey="adhd" stroke="#00687a" fill="url(#grad-adhd)" strokeWidth={2} dot={false} name="ADHD" />
                <Area type="monotone" dataKey="reading" stroke="#10B981" fill="url(#grad-reading)" strokeWidth={2} dot={false} name="Reading Difficulty" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      )}

      {activeTab === 'regional' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard style={{ padding: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Regional Risk Rate</h3>
            {rLoading ? <LoadingSpinner /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={regional} barSize={36}>
                  <XAxis dataKey="region" tick={{ fontSize: 12, fill: '#464555' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#464555' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(199,196,216,0.4)', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="riskRate" fill="#3525cd" radius={[6, 6, 0, 0]} name="Risk Rate %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard style={{ padding: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Regional Summary</h3>
            {rLoading ? <LoadingSpinner /> : (
              <div className="space-y-4">
                {regional?.map((r) => (
                  <div key={r.region} className="flex justify-between items-center p-4 rounded-xl" style={{ background: '#eff4ff' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 16 }}>{r.region} Region</p>
                      <p style={{ fontSize: 13, color: '#464555' }}>{r.schools} schools · {r.students.toLocaleString()} students</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full font-bold text-sm"
                      style={{
                        background: r.riskRate > 20 ? '#ffdad6' : r.riskRate > 15 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.1)',
                        color: r.riskRate > 20 ? '#ba1a1a' : r.riskRate > 15 ? '#92400e' : '#10B981',
                      }}
                    >
                      {r.riskRate}% risk
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {activeTab === 'radar' && (
        <GlassCard style={{ padding: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>AI Cognitive Profile Analysis</h3>
          <p style={{ fontSize: 14, color: '#464555', marginBottom: 24 }}>
            Multi-dimensional assessment of cognitive risk factors across the student cohort.
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(199,196,216,0.5)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#464555' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Risk Score" dataKey="A" stroke="#3525cd" fill="#3525cd" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(199,196,216,0.4)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}
    </div>
  )
}
