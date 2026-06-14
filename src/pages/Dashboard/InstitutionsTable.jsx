import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreVertical, ChevronLeft, ChevronRight, X, Key, Check, RotateCw } from 'lucide-react'
import { useInstitutions } from '../../hooks/useDashboard'
import { dashboardService } from '../../services'
import { Badge, ProgressBar, GlassCard, LoadingSpinner, ErrorState, useToast } from '../../components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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

const credentialsSchema = z.object({
  institutionName: z.string().min(3, 'Institution name must be at least 3 characters'),
  clientId: z.string().min(8, 'Client ID must be at least 8 alphanumeric characters'),
  apiSecret: z.string().min(12, 'API Secret must be at least 12 characters'),
  syncFreq: z.string(),
})

export function InstitutionsTable() {
  const { data, isLoading, isError, refetch } = useInstitutions()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const [page, setPage] = useState(1)
  const [district, setDistrict] = useState('all')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [syncingId, setSyncingId] = useState(null)

  const menuRef = useRef(null)

  // Sync Mutation
  const syncMutation = useMutation({
    mutationFn: async (id) => {
      setSyncingId(id)
      // Update screening timestamp and bump engagement slightly
      const now = new Date()
      const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      return dashboardService.updateInstitution(id, {
        lastScreening: formattedDate,
        engagement: Math.min(100, Math.floor(Math.random() * 20) + 75),
        status: 'active',
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'institutions'] })
      addToast(`Sync completed for ${data.name}!`, 'success')
      setSyncingId(null)
      setActiveMenuId(null)
    },
    onError: () => {
      addToast('Sync failed. Please try again.', 'error')
      setSyncingId(null)
    },
  })

  // Credentials form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      institutionName: '',
      clientId: '',
      apiSecret: '',
      syncFreq: 'daily',
    },
  })

  const onSubmitCredentials = async (formData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    addToast(`Credentials successfully configured for ${formData.institutionName}`, 'success')
    setShowCredentialsModal(false)
    reset()
  }

  // Handle click outside to close actions menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={refetch} />

  // Filter district before pagination
  const filtered = (data ?? []).filter(
    (inst) => district === 'all' || inst.region === district
  )

  const total = filtered.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSyncClick = (id) => {
    syncMutation.mutate(id)
  }

  return (
    <GlassCard style={{ overflow: 'visible', border: '1px solid rgba(199,196,216,0.3)' }}>
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
            onChange={(e) => {
              setDistrict(e.target.value)
              setPage(1) // Reset to first page on filter change
            }}
            className="rounded-lg px-3 py-2 cursor-pointer border hover:border-indigo-500/50 transition-colors"
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
          <button
            onClick={() => setShowCredentialsModal(true)}
            className="btn-ghost flex items-center gap-1.5"
          >
            <Key size={15} />
            Manage Credentials
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
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
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  No institutions found for the selected region.
                </td>
              </tr>
            ) : (
              paged.map((inst) => {
                const ic = INITIAL_COLOR[inst.initial] || INITIAL_COLOR.L
                const isSyncing = syncingId === inst.id
                return (
                  <tr key={inst.id} className="table-row">
                    {/* Institution */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0"
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
                              className="progress-fill bg-indigo-400"
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
                      <span className="flex items-center gap-2">
                        {isSyncing && <RotateCw size={14} className="animate-spin text-indigo-600" />}
                        {inst.lastScreening}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="table-cell relative" style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === inst.id ? null : inst.id)}
                        className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                        style={{ color: '#464555', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* Dropdown popup */}
                      <AnimatePresence>
                        {activeMenuId === inst.id && (
                          <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-6 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 text-left py-1"
                          >
                            <button
                              onClick={() => {
                                addToast(`Viewing detailed stats for ${inst.name}`, 'info')
                                setActiveMenuId(null)
                              }}
                              className="w-full px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 cursor-pointer transition-colors"
                            >
                              View School Dashboard
                            </button>
                            <button
                              onClick={() => handleSyncClick(inst.id)}
                              disabled={isSyncing}
                              className="w-full px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 cursor-pointer transition-colors flex items-center gap-1.5"
                            >
                              {isSyncing && <RotateCw size={13} className="animate-spin" />}
                              Sync Portal Data
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => {
                                addToast('Cannot delete standard demo institution', 'warning')
                                setActiveMenuId(null)
                              }}
                              className="w-full px-4 py-2 hover:bg-red-50 text-sm text-red-600 cursor-pointer transition-colors"
                            >
                              Disconnect School
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                )
              })
            )}
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
          Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} institutions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-slate-50"
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
              className="w-8 h-8 flex items-center justify-center rounded transition-colors"
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
            disabled={page === totalPages || totalPages === 0}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-slate-50"
            style={{
              border: '1px solid #777587',
              background: 'transparent',
              cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
              opacity: (page === totalPages || totalPages === 0) ? 0.5 : 1,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Credentials Modal Dialog */}
      <AnimatePresence>
        {showCredentialsModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Key size={18} />
                  <span className="font-bold text-slate-800 text-lg">API Credentials Manager</span>
                </div>
                <button
                  onClick={() => setShowCredentialsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmitCredentials)} className="p-6 space-y-4">
                <p className="text-sm text-slate-500">
                  Integrate your institution's student database (SIS) via secure OAuth2 credentials.
                </p>

                {/* Institution Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">School / District Name</label>
                  <input
                    type="text"
                    {...register('institutionName')}
                    placeholder="e.g. Washington Junior High"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm"
                  />
                  {errors.institutionName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.institutionName.message}</p>
                  )}
                </div>

                {/* Client ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">OAuth2 Client ID</label>
                  <input
                    type="text"
                    {...register('clientId')}
                    placeholder="e.g. client_usd_8204"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm font-mono"
                  />
                  {errors.clientId && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.clientId.message}</p>
                  )}
                </div>

                {/* Secret Key */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">API Secret Key</label>
                  <input
                    type="password"
                    {...register('apiSecret')}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm font-mono"
                  />
                  {errors.apiSecret && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.apiSecret.message}</p>
                  )}
                </div>

                {/* Sync Frequency */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Sync Interval</label>
                  <select
                    {...register('syncFreq')}
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 transition-colors text-sm bg-white"
                  >
                    <option value="realtime">Real-time Webhook</option>
                    <option value="hourly">Hourly Cron</option>
                    <option value="daily">Daily Midnight Sync</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCredentialsModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <RotateCw size={15} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Verify & Onboard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
