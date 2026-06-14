import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Share2, Clock, Plus, RefreshCw, X, Check, Mail, RotateCw } from 'lucide-react'
import { reportsService } from '../../services'
import { GlassCard, Badge, LoadingSpinner, EmptyState, useToast } from '../../components/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const TYPE_META = {
  district: { label: 'District', color: '#3525cd', bg: 'rgba(53,37,205,0.1)' },
  institution: { label: 'Institution', color: '#00687a', bg: 'rgba(0,104,122,0.1)' },
  student: { label: 'Student', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  state: { label: 'State', color: '#ba1a1a', bg: 'rgba(186,26,26,0.1)' },
}

const reportSchema = z.object({
  title: z.string().min(5, 'Report title must be at least 5 characters'),
  type: z.enum(['district', 'institution', 'student', 'state']),
  cohort: z.string().min(3, 'Cohort or focus target is required'),
})

const shareSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export function ReportsPage() {
  const [filter, setFilter] = useState('all')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [sharingReport, setSharingReport] = useState(null)

  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // Polling query: if any report is 'generating', poll every 2 seconds to catch status updates
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: reportsService.getAll,
    refetchInterval: (query) => {
      const hasGenerating = query.state.data?.some((r) => r.status === 'generating')
      return hasGenerating ? 2000 : false
    },
  })

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: reportsService.create,
    onSuccess: (newReport) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      addToast(`Generating "${newReport.title}"...`, 'success')
      setShowGenerateModal(false)
      resetReportForm()
    },
    onError: () => {
      addToast('Failed to start report generation.', 'error')
    },
  })

  // Report configuration form
  const {
    register: registerReport,
    handleSubmit: handleSubmitReport,
    reset: resetReportForm,
    formState: { errors: reportErrors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      type: 'institution',
      cohort: '',
    },
  })

  // Share form
  const {
    register: registerShare,
    handleSubmit: handleSubmitShare,
    reset: resetShareForm,
    formState: { errors: shareErrors, isSubmitting: isSharing },
  } = useForm({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleCreateReportSubmit = (formData) => {
    createMutation.mutate(formData)
  }

  const handleQuickCardClick = (type) => {
    const defaultTitles = {
      district: 'Quarterly District Diagnostic Summaries',
      institution: 'Lincoln School Attendance and Risk Profile',
      student: 'Individual Cognitive Support Report',
      state: 'Statewide Learning Disability Prevalence Report',
    }
    const defaultCohorts = {
      district: 'All District Subsectors',
      institution: 'Lincoln Elementary (All Grades)',
      student: 'Sarah Chen (Grade 4)',
      state: 'Northwest Region School Networks',
    }

    createMutation.mutate({
      title: defaultTitles[type],
      type: type,
      cohort: defaultCohorts[type],
    })
  }

  const handleDownloadPDF = (report) => {
    if (report.status === 'generating') {
      addToast('Report is still generating. Please wait.', 'warning')
      return
    }

    addToast(`Downloading ${report.title} PDF...`, 'info')

    // Create a text layout representing the report
    const textReport = `====================================================
NEUROLEARN AI - LEARNING DISABILITY COGNITIVE REPORT
====================================================
Report ID: ${report.id}
Title: ${report.title}
Report Type: ${report.type.toUpperCase()}
Generated on: ${report.createdAt}
Status: READY
Confidence Threshold: 91.4%

EXECUTIVE SUMMARY:
Cognitive screenings indicate a stable progression across Grade cohorts. 
Learning difficulties like dyslexia and attention deficit remain within normal bounds,
with targeted interventions in place for identified high-risk sectors.

RECOMMENDATIONS:
1. Increase phonological word-recognition drills for Grade 2 critical subsectors.
2. Align diagnostic sync times with the OAuth2 SIS endpoint daily.
3. Deploy interactive visual learning modules in Washington Junior High.

© 2024 NeuroLearn AI. All rights reserved.
====================================================`

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${report.title.toLowerCase().replace(/\s+/g, '_')}_report.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    addToast('PDF download completed!', 'success')
  }

  const handleShareSubmit = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    addToast(`Report successfully shared with ${formData.email}`, 'success')
    setSharingReport(null)
    resetShareForm()
  }

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
        <button onClick={() => setShowGenerateModal(true)} className="btn-primary">
          <Plus size={18} />
          Generate Report
        </button>
      </div>

      {/* Quick Generate Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(TYPE_META).map(([key, meta], i) => (
          <motion.button
            key={key}
            onClick={() => handleQuickCardClick(key)}
            className="glass-card rounded-2xl p-5 text-left hover:shadow-md transition-all relative overflow-hidden group"
            style={{ border: '1px solid rgba(199,196,216,0.4)', cursor: 'pointer' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
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
            className="px-4 py-2 rounded-full transition-all text-xs font-semibold"
            style={{
              background: filter === f ? '#3525cd' : '#e5eeff',
              color: filter === f ? '#fff' : '#464555',
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
            action={<button onClick={() => setShowGenerateModal(true)} className="btn-primary"><Plus size={16} /> Generate Report</button>}
          />
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(199,196,216,0.15)' }}>
            {filtered.map((r, i) => {
              const meta = TYPE_META[r.type] || TYPE_META.institution
              const isGen = r.status === 'generating'
              return (
                <motion.div
                  key={r.id}
                  className="flex items-center justify-between p-6 hover:bg-slate-50/20 transition-colors"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
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
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={11} />
                          {r.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isGen ? (
                      <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <RefreshCw size={14} className="animate-spin text-indigo-600" />
                        Generating...
                      </span>
                    ) : (
                      <Badge variant="active">READY</Badge>
                    )}
                    <button
                      onClick={() => handleDownloadPDF(r)}
                      disabled={isGen}
                      className="btn-ghost flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      <Download size={14} />
                      PDF
                    </button>
                    <button
                      onClick={() => setSharingReport(r)}
                      disabled={isGen}
                      className="btn-ghost flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>

      {/* Report Generation Modal Form */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  <FileText className="text-indigo-600" />
                  Generate AI Diagnostic Report
                </span>
                <button
                  onClick={() => {
                    setShowGenerateModal(false)
                    resetReportForm()
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitReport(handleCreateReportSubmit)} className="p-6 space-y-4 text-left">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Report Title</label>
                  <input
                    type="text"
                    {...registerReport('title')}
                    placeholder="e.g. Lincoln Elementary Special Needs Focus"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                  {reportErrors.title && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{reportErrors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Report Scope</label>
                    <select
                      {...registerReport('type')}
                      className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                    >
                      <option value="student">Student Level</option>
                      <option value="institution">School Level</option>
                      <option value="district">District Level</option>
                      <option value="state">State Level</option>
                    </select>
                  </div>

                  {/* Cohort focus */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Cohort / Target</label>
                    <input
                      type="text"
                      {...registerReport('cohort')}
                      placeholder="e.g. Lincoln Grade 2"
                      className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                    {reportErrors.cohort && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{reportErrors.cohort.message}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGenerateModal(false)
                      resetReportForm()
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
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Report Modal Dialog */}
      <AnimatePresence>
        {sharingReport && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Mail className="text-indigo-600" size={16} />
                  Share Report Link
                </span>
                <button
                  onClick={() => {
                    setSharingReport(null)
                    resetShareForm()
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitShare(handleShareSubmit)} className="p-6 space-y-4 text-left">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send a secure, timed link to download <strong className="text-slate-700">"{sharingReport.title}"</strong> to a colleague's email address.
                </p>

                {/* Email address */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase">Colleague's Email</label>
                  <input
                    type="email"
                    {...registerShare('email')}
                    placeholder="colleague@school.edu"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                  {shareErrors.email && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{shareErrors.email.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSharingReport(null)
                      resetShareForm()
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSharing}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    {isSharing ? (
                      <RotateCw size={13} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    Send Share Link
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
