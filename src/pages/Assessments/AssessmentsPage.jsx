import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, Download, Eye, ClipboardCheck, Mic, Keyboard, Scan, X, Check, RotateCw, BarChart2
} from 'lucide-react'
import { assessmentService } from '../../services'
import { Badge, GlassCard, EmptyState, LoadingSpinner, useToast } from '../../components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

const assessmentFormSchema = z.object({
  student: z.string().min(3, 'Student name must be at least 3 characters'),
  type: z.enum(['Reading', 'Voice', 'Typing', 'Eye Tracking']),
  status: z.enum(['completed', 'in-progress', 'scheduled']),
  score: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().min(0).max(100).nullable()),
  risk: z.enum(['low', 'moderate', 'high', 'none']),
  date: z.string().min(10, 'Valid date required'),
})

export function AssessmentsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Modals & Panels State
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState(null)

  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: assessmentService.getAll,
  })

  // Dynamic filter counts
  const getCount = (type) => (data ?? []).filter((a) => a.type === type).length

  // Create Assessment Mutation
  const createMutation = useMutation({
    mutationFn: assessmentService.create,
    onSuccess: (newAss) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
      addToast(`New assessment created for ${newAss.student}!`, 'success')
      setShowAddModal(false)
      resetForm()
    },
    onError: () => {
      addToast('Failed to create assessment.', 'error')
    },
  })

  // Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      student: '',
      type: 'Reading',
      status: 'scheduled',
      score: '',
      risk: 'none',
      date: new Date().toISOString().split('T')[0],
    },
  })

  // Monitor status to dynamically clear score/risk if scheduled
  const watchStatus = watch('status')
  useEffect(() => {
    if (watchStatus === 'scheduled') {
      setValue('score', '')
      setValue('risk', 'none')
    }
  }, [watchStatus, setValue])

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      score: formData.status === 'scheduled' ? null : formData.score,
      risk: formData.risk === 'none' || formData.status === 'scheduled' ? null : formData.risk,
    }
    createMutation.mutate(payload)
  }

  // Filter logic
  const filtered = (data ?? []).filter((a) => {
    const matchSearch =
      a.student.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || a.type === typeFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  // Export filtered assessments list to CSV
  const handleExport = () => {
    if (filtered.length === 0) {
      addToast('No assessments to export.', 'warning')
      return
    }
    addToast('Generating CSV export...', 'info')
    const headers = ['ID', 'Student', 'Type', 'Status', 'Score', 'Risk', 'Date']
    const rows = filtered.map((a) => [
      a.id,
      a.student,
      a.type,
      a.status,
      a.score !== null ? `${a.score}/100` : '—',
      a.risk || '—',
      a.date,
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.map((val) => `"${val}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `neurolearn_assessments_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('CSV export downloaded successfully!', 'success')
  }

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
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} />
          New Assessment
        </button>
      </div>

      {/* Assessment Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { type: 'Reading', icon: <ClipboardCheck size={28} color="#3525cd" /> },
          { type: 'Voice', icon: <Mic size={28} color="#00687a" /> },
          { type: 'Typing', icon: <Keyboard size={28} color="#10B981" /> },
          { type: 'Eye Tracking', icon: <Scan size={28} color="#ba1a1a" /> },
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
            <p style={{ fontSize: 14, color: '#464555' }}>
              {isLoading ? '...' : getCount(t.type)} Active
            </p>
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
              className="cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <button onClick={handleExport} className="btn-ghost flex items-center gap-2">
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
            action={<button onClick={() => setShowAddModal(true)} className="btn-primary"><Plus size={16} /> New Assessment</button>}
          />
        ) : (
          <div className="overflow-x-auto">
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
                    className="hover:bg-slate-50/50 transition-colors"
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
                        onClick={() => setSelectedAssessment(a)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors bg-none border-none cursor-pointer flex items-center gap-1.5 font-semibold text-sm"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Slide-over Detailed Assessment Diagnostics Panel */}
      <AnimatePresence>
        {selectedAssessment && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex justify-end">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setSelectedAssessment(null)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-100"
            >
              {/* Panel Header */}
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Assessment Details</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedAssessment.student}</h3>
                </div>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Meta stats list */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs text-slate-400 font-medium uppercase">Assessment ID</span>
                    <p className="text-sm font-mono font-bold mt-0.5">{selectedAssessment.id}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs text-slate-400 font-medium uppercase">Diagnostic Mode</span>
                    <p className="text-sm font-bold flex items-center gap-1.5 mt-0.5 text-slate-800">
                      {TYPE_ICON[selectedAssessment.type]}
                      {selectedAssessment.type}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs text-slate-400 font-medium uppercase">Assessment Date</span>
                    <p className="text-sm font-bold mt-0.5 text-slate-800">{selectedAssessment.date}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs text-slate-400 font-medium uppercase">Screening Result</span>
                    <div className="mt-1">
                      <Badge variant={STATUS_BADGE[selectedAssessment.status]}>
                        {selectedAssessment.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Score & Risk */}
                {selectedAssessment.status === 'completed' && (
                  <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-indigo-50/10">
                    <div className="flex-1 text-center border-r border-slate-100">
                      <span className="text-xs text-slate-400 font-bold uppercase">Performance Score</span>
                      <p className="text-3xl font-extrabold text-indigo-600 mt-1">{selectedAssessment.score}/100</p>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-slate-400 font-bold uppercase">Risk prevalence</span>
                      <p
                        className="text-3xl font-extrabold mt-1"
                        style={{ color: RISK_COLOR[selectedAssessment.risk] || '#777587' }}
                      >
                        {selectedAssessment.risk ? selectedAssessment.risk.toUpperCase() : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Simulated Cognitive AI Diagnostics metrics */}
                <div className="space-y-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm border-b pb-2">
                    <BarChart2 size={16} className="text-indigo-600" />
                    Cognitive Breakdown & Neural Metrics
                  </div>

                  {selectedAssessment.status !== 'completed' ? (
                    <div className="py-8 text-center text-sm text-slate-400 italic">
                      Diagnostics metrics are available once screening is completed.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedAssessment.type === 'Reading' && (
                        <>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Phonological Awareness</span>
                              <span>84%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '84%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Sight Word Decoding Latency</span>
                              <span>112 wpm (Normal)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Letter-Sound Correspondence</span>
                              <span>62% (At-risk)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full rounded-full" style={{ width: '62%' }} />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedAssessment.type === 'Voice' && (
                        <>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Speech Flight Latency</span>
                              <span>1.2 seconds</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Phoneme Jitter Confidence</span>
                              <span>91% (Stable)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '91%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Auditory Syllable Processing</span>
                              <span>54% (At-risk)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full rounded-full" style={{ width: '54%' }} />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedAssessment.type === 'Typing' && (
                        <>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Keystroke Flight Duration</span>
                              <span>114 ms (Stable)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Key Hesitation Index</span>
                              <span>32% (Elevated)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: '32%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Backspace Correction Ratio</span>
                              <span>12%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '68%' }} />
                            </div>
                          </div>
                        </>
                      )}

                      {selectedAssessment.type === 'Eye Tracking' && (
                        <>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Saccadic Regression Rate</span>
                              <span>18% (Elevated)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-red-500 h-full rounded-full" style={{ width: '82%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Average Fixation Duration</span>
                              <span>240 ms (Normal)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '90%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                              <span>Spatial Search Accuracy</span>
                              <span>76%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '76%' }} />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl text-xs text-slate-500 space-y-2 mt-4">
                        <p className="font-bold text-slate-700">AI Diagnostic Report Summary:</p>
                        <p className="leading-relaxed">
                          Neural cognitive indicators suggest mild difficulties in phonological decoding. Recommended intervention consists of structured phonics instruction focusing on segmenting and blending skills.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => {
                    addToast('Downloading biometric CSV raw file...', 'info')
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                >
                  Export Raw Log
                </button>
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Assessment Creation Dialog Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <ClipboardCheck className="text-indigo-600" />
                  Configure New Screening
                </span>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-left">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Student Name</label>
                  <input
                    type="text"
                    {...register('student')}
                    placeholder="e.g. Liam Chen"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                  {errors.student && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.student.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Assessment Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Assessment Type</label>
                    <select
                      {...register('type')}
                      className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                    >
                      <option value="Reading">Reading</option>
                      <option value="Voice">Voice</option>
                      <option value="Typing">Typing</option>
                      <option value="Eye Tracking">Eye Tracking</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Status</label>
                    <select
                      {...register('status')}
                      className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {watchStatus !== 'scheduled' && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Performance Score */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Score (0-100)</label>
                      <input
                        type="number"
                        {...register('score')}
                        placeholder="e.g. 85"
                        className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                      />
                      {errors.score && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.score.message}</p>
                      )}
                    </div>

                    {/* Risk Factor */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Cognitive Risk Factor</label>
                      <select
                        {...register('risk')}
                        className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                      >
                        <option value="none">None</option>
                        <option value="low">Low Risk</option>
                        <option value="moderate">Moderate Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Screening Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Scheduled Date</label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                  />
                  {errors.date && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.date.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="btn-primary flex items-center gap-1.5"
                  >
                    {createMutation.isPending ? (
                      <RotateCw size={15} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Launch Screening
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
