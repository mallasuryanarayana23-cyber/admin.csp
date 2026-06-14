import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar,
} from 'recharts'
import { analyticsService } from '../../services'
import { GlassCard, LoadingSpinner, Badge } from '../../components/ui'
import { TrendingUp, Activity, MapPin, Users, Lightbulb, X, Filter } from 'lucide-react'

const COHORT_KPIS = {
  all: { avgRisk: '18.5%', intervention: '73%', velocity: '142/day', confidence: '91.4%' },
  g1: { avgRisk: '15.2%', intervention: '80%', velocity: '32/day', confidence: '93.1%' },
  g2: { avgRisk: '20.8%', intervention: '68%', velocity: '41/day', confidence: '88.5%' },
  g3: { avgRisk: '14.8%', intervention: '75%', velocity: '28/day', confidence: '91.2%' },
  g4: { avgRisk: '22.4%', intervention: '64%', velocity: '24/day', confidence: '90.7%' },
  g5: { avgRisk: '11.2%', intervention: '85%', velocity: '17/day', confidence: '94.2%' },
}

const COHORT_NAMES = {
  all: 'All Students cohort',
  g1: 'Grade 1 cohort',
  g2: 'Grade 2 cohort',
  g3: 'Grade 3 cohort',
  g4: 'Grade 4 cohort',
  g5: 'Grade 5 cohort',
}

const COGNITIVE_INTERVENTIONS = {
  'Phonological': {
    title: 'Phonological Awareness Intervention',
    risk: 'High (78%)',
    description: 'Difficulty in manipulating individual sounds (phonemes) within words. Standard marker for reading disabilities.',
    strategies: [
      'Phoneme isolation: practice isolating beginning, middle, and ending sounds in short words.',
      'Segmenting & Blending: break spoken words into sounds, and blend sounds to form words.',
      'Elkonin boxes: use physical tokens to represent individual sounds in words visually.',
    ],
  },
  'Rapid Naming': {
    title: 'Rapid Automatized Naming (RAN) Support',
    risk: 'Moderate (52%)',
    description: 'Slowness in naming aloud familiar visual items (colors, letters, shapes). Indicates word-retrieval latency.',
    strategies: [
      'Visual-verbal mapping drills: timed naming charts of objects, colors, and numbers.',
      'Automaticity training: repetitive high-frequency word recognition lists.',
      'Semantic categorization: grouping objects into conceptual frames under soft speed constraints.',
    ],
  },
  'Working Mem': {
    title: 'Working Memory Support Strategy',
    risk: 'Moderate (64%)',
    description: 'Challenges in holding and processing auditory or visual details in memory.',
    strategies: [
      'Task chunking: break verbal classroom prompts into smaller, visual checklists.',
      'Auditory sequencing: repeat back digit spans, letters, or instructions in reverse order.',
      'Dual-coding representations: present concepts using visual diagrams along with verbal labels.',
    ],
  },
  'Processing': {
    title: 'Cognitive Processing Speed Optimization',
    risk: 'Elevated (71%)',
    description: 'Slowness in responding to cognitive prompts or scanning visual text arrays.',
    strategies: [
      'Visual search cards: finding target shapes/letters amidst distracting fields.',
      'Extended assessment time: grant 1.5x time allowances on timed worksheets.',
      'Paced task schedules: structure assignments in 15-minute bursts followed by short resets.',
    ],
  },
  'Attention': {
    title: 'Focus & Attention Diagnostics Strategy',
    risk: 'Moderate (45%)',
    description: 'Fluctuating alertness or visual distractibility during assessment cycles.',
    strategies: [
      'Visual dividers: block out surrounding visual stimuli on testing desks.',
      'Pomodoro system: utilize interactive visual sand timers for study blocks.',
      'Movement breaks: incorporate brief kinetic activities every 20 minutes.',
    ],
  },
  'Visual': {
    title: 'Visual-Spatial Processing Intervention',
    risk: 'Moderate (59%)',
    description: 'Difficulty distinguishing visual patterns, spatial orientations, or letters.',
    strategies: [
      'Spatial reconstruction: copy 3D blocks or tangram geometry puzzles.',
      'Tracking aides: use colored line-guider rulers when reading text blocks.',
      'High-contrast layouts: employ clean dark/light UI modes to reduce visual crowding.',
    ],
  },
}

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('trends')
  const [cohort, setCohort] = useState('all')
  const [selectedDimension, setSelectedDimension] = useState(null)

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

  const activeKpis = COHORT_KPIS[cohort]

  // Recharts interactive radar click handler
  const handleRadarClick = (node) => {
    if (node && node.activePayload && node.activePayload[0]) {
      const name = node.activePayload[0].payload.subject
      if (COGNITIVE_INTERVENTIONS[name]) {
        setSelectedDimension(name)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Cohort filter */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0b1c30' }}>Analytics Suite</h2>
          <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
            Predictive insights and risk intelligence across your institution network.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm w-fit">
          <Filter size={15} className="text-indigo-600 shrink-0" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cohort Focus:</span>
          <select
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            className="text-sm font-semibold text-slate-800 outline-none bg-transparent cursor-pointer"
          >
            <option value="all">System Cohort (All)</option>
            <option value="g1">Grade 1</option>
            <option value="g2">Grade 2</option>
            <option value="g3">Grade 3</option>
            <option value="g4">Grade 4</option>
            <option value="g5">Grade 5</option>
          </select>
        </div>
      </div>

      {/* KPI Row - recalculating summaries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Risk Score', value: activeKpis.avgRisk, icon: <Activity size={20} color="#ba1a1a" />, bg: 'rgba(186,26,26,0.1)', color: '#ba1a1a' },
          { label: 'Intervention Rate', value: activeKpis.intervention, icon: <Users size={20} color="#10B981" />, bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
          { label: 'Screening Velocity', value: activeKpis.velocity, icon: <TrendingUp size={20} color="#3525cd" />, bg: 'rgba(53,37,205,0.12)', color: '#3525cd' },
          { label: 'AI Confidence', value: activeKpis.confidence, icon: <Activity size={20} color="#00687a" />, bg: 'rgba(0,104,122,0.12)', color: '#00687a' },
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
            <span className="text-[10px] text-slate-400 mt-1 block italic">{COHORT_NAMES[cohort]}</span>
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
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>AI Cognitive Profile Analysis</h3>
              <p style={{ fontSize: 14, color: '#464555', marginBottom: 24 }}>
                Multi-dimensional assessment of cognitive risk factors. Click on any axis/node or select below to analyze interventions.
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} onClick={handleRadarClick} className="cursor-pointer">
                  <PolarGrid stroke="rgba(199,196,216,0.5)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#464555', cursor: 'pointer' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Risk Score" dataKey="A" stroke="#3525cd" fill="#3525cd" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(199,196,216,0.4)', borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Cognitive Dimensions</h3>
              <p className="text-xs text-slate-500 mb-4">Click a category to expand diagnostic strategies.</p>
              <div className="space-y-2">
                {Object.keys(COGNITIVE_INTERVENTIONS).map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedDimension(name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all flex justify-between items-center"
                    style={{
                      borderColor: selectedDimension === name ? '#3525cd' : 'rgba(199,196,216,0.3)',
                      background: selectedDimension === name ? 'rgba(53,37,205,0.06)' : 'transparent',
                      color: selectedDimension === name ? '#3525cd' : '#0b1c30',
                    }}
                  >
                    <span>{COGNITIVE_INTERVENTIONS[name].title.replace(' Intervention', '').replace(' Support Strategy', '').replace(' Support', '')}</span>
                    <Badge variant={name === 'Phonological' ? 'warning' : 'info'}>
                      {COGNITIVE_INTERVENTIONS[name].risk}
                    </Badge>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Interactive Intervention Drawer */}
          <AnimatePresence>
            {selectedDimension && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <GlassCard style={{ padding: 24, border: '1px solid rgba(53,37,205,0.2)' }} className="bg-indigo-50/5 relative">
                  <button
                    onClick={() => setSelectedDimension(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
                      <Lightbulb size={24} />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          {COGNITIVE_INTERVENTIONS[selectedDimension].title}
                          <Badge variant="warning">{COGNITIVE_INTERVENTIONS[selectedDimension].risk} Risk Rate</Badge>
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{COGNITIVE_INTERVENTIONS[selectedDimension].description}</p>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recommended Classroom Strategies:</p>
                        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                          {COGNITIVE_INTERVENTIONS[selectedDimension].strategies.map((strategy, index) => (
                            <li key={index}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
