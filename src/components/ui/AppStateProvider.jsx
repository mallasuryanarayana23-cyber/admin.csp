/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AppStateContext = createContext(null)

const INITIAL_INSTITUTIONS = [
  {
    id: 1,
    initial: 'L',
    name: 'Lincoln Elementary',
    students: 840,
    teachers: 24,
    status: 'active',
    engagement: 88,
    riskFactor: 'Low (12%)',
    riskLevel: 'low',
    lastScreening: 'Oct 24, 2023',
    region: 'north',
  },
  {
    id: 2,
    initial: 'W',
    name: 'Washington Junior High',
    students: 1120,
    teachers: 48,
    status: 'active',
    engagement: 62,
    riskFactor: 'Critical (22%)',
    riskLevel: 'critical',
    lastScreening: 'Oct 22, 2023',
    region: 'south',
  },
  {
    id: 3,
    initial: 'S',
    name: "St. Mary's Academy",
    students: 450,
    teachers: 18,
    status: 'onboarding',
    engagement: 5,
    riskFactor: 'N/A',
    riskLevel: 'na',
    lastScreening: '--',
    region: 'north',
  },
  {
    id: 4,
    initial: 'R',
    name: 'Roosevelt High School',
    students: 1340,
    teachers: 62,
    status: 'active',
    engagement: 74,
    riskFactor: 'Moderate (16%)',
    riskLevel: 'moderate',
    lastScreening: 'Oct 20, 2023',
    region: 'south',
  },
  {
    id: 5,
    initial: 'J',
    name: 'Jefferson Preparatory',
    students: 680,
    teachers: 31,
    status: 'active',
    engagement: 91,
    riskFactor: 'Low (9%)',
    riskLevel: 'low',
    lastScreening: 'Oct 25, 2023',
    region: 'north',
  },
]

const INITIAL_ASSESSMENTS = [
  { id: 'A001', student: 'Emma Johnson', type: 'Reading', status: 'completed', score: 92, risk: 'low', date: '2023-10-24' },
  { id: 'A002', student: 'Liam Chen', type: 'Voice', status: 'in-progress', score: null, risk: 'moderate', date: '2023-10-25' },
  { id: 'A003', student: 'Sophia Patel', type: 'Typing', status: 'completed', score: 67, risk: 'high', date: '2023-10-23' },
  { id: 'A004', student: 'Noah Kim', type: 'Eye Tracking', status: 'scheduled', score: null, risk: null, date: '2023-10-26' },
  { id: 'A005', student: 'Ava Martinez', type: 'Reading', status: 'completed', score: 88, risk: 'low', date: '2023-10-22' },
  { id: 'A006', student: 'Ethan Brown', type: 'Voice', status: 'completed', score: 55, risk: 'high', date: '2023-10-21' },
]

const INITIAL_REPORTS = [
  { id: 'R001', title: 'Q3 District Report', type: 'district', createdAt: '2023-10-01', status: 'ready' },
  { id: 'R002', title: 'Lincoln Elementary — October', type: 'institution', createdAt: '2023-10-15', status: 'ready' },
  { id: 'R003', title: 'Emma Johnson — Full Assessment', type: 'student', createdAt: '2023-10-24', status: 'generating' },
]

const INITIAL_PROFILE = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@neurolearn.edu',
  phone: '+1 555 012 3456',
  role: 'Administrator',
  institution: 'Lincoln Unified School District',
  avatarUrl: null,
  // Preference settings
  preferences: {
    emailDigest: 'weekly',
    smsAlerts: true,
    theme: 'light',
    defaultLanding: '/dashboard',
  },
  organization: {
    name: 'Lincoln Unified School District',
    id: 'LUSD-94021',
    region: 'North Sector',
    billingPlan: 'Enterprise SaaS',
    contactEmail: 'admin@lincoln.edu',
  },
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'alert', message: 'Risk Alert: Grade 4 (Sector B)', read: false, time: '10m ago' },
  { id: 2, type: 'info', message: 'New teacher signup: Washington JH', read: false, time: '1h ago' },
  { id: 3, type: 'success', message: 'Screening batch completed for Lincoln Elementary', read: true, time: '1d ago' },
]

export function AppStateProvider({ children }) {
  const [institutions, setInstitutions] = useState(() => {
    const saved = localStorage.getItem('neurolearn_institutions')
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS
  })

  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('neurolearn_assessments')
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS
  })

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('neurolearn_reports')
    return saved ? JSON.parse(saved) : INITIAL_REPORTS
  })

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('neurolearn_profile')
    return saved ? JSON.parse(saved) : INITIAL_PROFILE
  })

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('neurolearn_notifications')
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS
  })

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('neurolearn_institutions', JSON.stringify(institutions))
  }, [institutions])

  useEffect(() => {
    localStorage.setItem('neurolearn_assessments', JSON.stringify(assessments))
  }, [assessments])

  useEffect(() => {
    localStorage.setItem('neurolearn_reports', JSON.stringify(reports))
  }, [reports])

  useEffect(() => {
    localStorage.setItem('neurolearn_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('neurolearn_notifications', JSON.stringify(notifications))
  }, [notifications])

  // Actions
  const addAssessment = (assessment) => {
    setAssessments((prev) => [
      {
        id: `A${String(prev.length + 1).padStart(3, '0')}`,
        ...assessment,
      },
      ...prev,
    ])
  }

  const addReport = (report) => {
    const newReport = {
      id: `R${String(reports.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'generating',
      ...report,
    }
    setReports((prev) => [newReport, ...prev])

    // Simulate async report generator delay
    setTimeout(() => {
      setReports((currentReports) =>
        currentReports.map((r) =>
          r.id === newReport.id ? { ...r, status: 'ready' } : r
        )
      )
      // Push completion notification
      addNotification({
        type: 'success',
        message: `Report "${newReport.title}" is ready for download`,
      })
    }, 4000)
  }

  const updateInstitution = (id, updatedFields) => {
    setInstitutions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, ...updatedFields } : inst))
    )
  }

  const updateProfile = (updatedProfile) => {
    setProfile((prev) => ({ ...prev, ...updatedProfile }))
  }

  const addNotification = (notif) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        read: false,
        time: 'Just now',
        ...notif,
      },
      ...prev,
    ])
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <AppStateContext.Provider
      value={{
        institutions,
        assessments,
        reports,
        profile,
        notifications,
        addAssessment,
        addReport,
        updateInstitution,
        updateProfile,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}
