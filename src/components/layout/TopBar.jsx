import { useState, useEffect, useRef } from 'react'
import { Search, Bell, Check, Trash2, X, ClipboardCheck, School, FileText } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { useAppState } from '../ui/AppStateProvider'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function TopBar() {
  const [query, setQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)

  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useNotifications()

  const { assessments, institutions, reports } = useAppState()
  const navigate = useNavigate()

  const searchRef = useRef(null)
  const notifRef = useRef(null)

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter local data for global search
  const filteredStudents = query
    ? assessments.filter((a) => a.student.toLowerCase().includes(query.toLowerCase()))
    : []
  const filteredSchools = query
    ? institutions.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : []
  const filteredReports = query
    ? reports.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const totalResults = filteredStudents.length + filteredSchools.length + filteredReports.length

  const handleSearchResultClick = (type, target) => {
    setQuery('')
    setShowSearchDropdown(false)
    if (type === 'student') {
      navigate('/assessments', { state: { searchFilter: target.student } })
    } else if (type === 'school') {
      navigate('/dashboard', { state: { schoolSearch: target.name } })
    } else if (type === 'report') {
      navigate('/reports', { state: { reportSearch: target.title } })
    }
  }

  return (
    <header
      className="h-16 flex justify-between items-center px-6 sticky top-0 z-40"
      style={{
        background: 'rgba(248,249,255,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(199,196,216,0.2)',
      }}
    >
      {/* Search */}
      <div ref={searchRef} className="relative">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-full w-96 transition-all border border-transparent focus-within:border-indigo-500/20"
          style={{ background: '#eff4ff' }}
        >
          <Search size={18} color="#464555" />
          <input
            type="text"
            placeholder="Search students, classes, or reports..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSearchDropdown(true)
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="bg-transparent border-none outline-none w-full placeholder-slate-400"
            style={{ fontSize: 14, color: '#0b1c30' }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        <AnimatePresence>
          {showSearchDropdown && query && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-96 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto"
            >
              {totalResults === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No matches found for "{query}"
                </div>
              ) : (
                <div className="p-2 space-y-3">
                  {/* Students */}
                  {filteredStudents.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Students</p>
                      {filteredStudents.slice(0, 3).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSearchResultClick('student', s)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <ClipboardCheck size={16} className="text-indigo-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{s.student}</p>
                            <p className="text-xs text-slate-500">ID: {s.id} · {s.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Schools / Institutions */}
                  {filteredSchools.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Institutions</p>
                      {filteredSchools.slice(0, 3).map((sch) => (
                        <button
                          key={sch.id}
                          onClick={() => handleSearchResultClick('school', sch)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <School size={16} className="text-teal-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{sch.name}</p>
                            <p className="text-xs text-slate-500">{sch.students} students · {sch.riskFactor}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Reports */}
                  {filteredReports.length > 0 && (
                    <div>
                      <p className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Reports</p>
                      {filteredReports.slice(0, 3).map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleSearchResultClick('report', r)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg flex items-center gap-2.5 transition-colors"
                        >
                          <FileText size={16} className="text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{r.title}</p>
                            <p className="text-xs text-slate-500">Type: {r.type} · Created: {r.createdAt}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Zone */}
      <div className="flex items-center gap-6">
        {/* Notifications Bell with Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifDropdown((v) => !v)}
            className="relative rounded-full p-2 transition-all hover:bg-slate-100 cursor-pointer"
          >
            <Bell size={22} color="#0b1c30" />
            {unreadCount > 0 && (
              <span
                className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full border border-white"
                style={{ background: '#ba1a1a' }}
              />
            )}
          </button>

          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {/* Notif Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-800">Notifications ({unreadCount})</span>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                        title="Mark all read"
                      >
                        <Check size={14} className="inline mr-0.5" />
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
                        title="Clear all"
                      >
                        <Trash2 size={13} className="inline mr-0.5" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Notif List */}
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">
                      All clean! No new notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 flex items-start gap-2.5 transition-colors cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/20' : ''}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        />
                        <div className="flex-1">
                          <p className={`text-xs text-slate-700 leading-normal ${!n.read ? 'font-semibold' : ''}`}>
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time || 'just now'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Info */}
        <div
          className="flex items-center gap-3 pl-6"
          style={{ borderLeft: '1px solid rgba(199,196,216,0.4)' }}
        >
          <div className="text-right">
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>Dr. Sarah Chen</p>
            <p style={{ fontSize: 12, color: '#464555' }}>Administrator</p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white cursor-pointer hover:scale-105 transition-transform"
            style={{ background: '#3525cd', fontSize: 16 }}
            onClick={() => navigate('/profile')}
          >
            SC
          </div>
        </div>
      </div>
    </header>
  )
}
