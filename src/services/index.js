// ─────────────────────────────────────────────
// LocalStorage-backed service layer simulating an async API
// All functions return Promises to simulate network latency
// ─────────────────────────────────────────────

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const INITIAL_STATS = {
  totalStudents: 12482,
  studentsTrend: '+12%',
  riskPrevalence: 18.5,
  riskTrend: '+2.4%',
  completedScreenings: 8902,
  screeningsTrend: '+5%',
  activeInstitutions: 42,
}

const INITIAL_PERFORMANCE = [
  { grade: 'Grade 1', mastery: 160, progressing: 48, atRisk: 32 },
  { grade: 'Grade 2', mastery: 128, progressing: 80, atRisk: 48 },
  { grade: 'Grade 3', mastery: 176, progressing: 40, atRisk: 24 },
  { grade: 'Grade 4', mastery: 112, progressing: 96, atRisk: 64 },
  { grade: 'Grade 5', mastery: 208, progressing: 32, atRisk: 16 },
]

const INITIAL_RISK_TYPOLOGY = [
  { name: 'Phonological', value: 58, color: '#3525cd' },
  { name: 'Rapid Naming', value: 24, color: '#00687a' },
  { name: 'Visual Processing', value: 18, color: '#ba1a1a' },
]

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

const getStored = (key, initial) => {
  const data = localStorage.getItem(key)
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(data)
}

const setStored = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

export const dashboardService = {
  getStats: async () => {
    await delay(300)
    return getStored('neurolearn_stats', INITIAL_STATS)
  },

  getPerformanceDistribution: async () => {
    await delay(300)
    return getStored('neurolearn_performance', INITIAL_PERFORMANCE)
  },

  getRiskTypology: async () => {
    await delay(200)
    return getStored('neurolearn_risk_typology', INITIAL_RISK_TYPOLOGY)
  },

  getInstitutions: async () => {
    await delay(400)
    return getStored('neurolearn_institutions', INITIAL_INSTITUTIONS)
  },

  updateInstitution: async (id, fields) => {
    await delay(500)
    const list = getStored('neurolearn_institutions', INITIAL_INSTITUTIONS)
    const updated = list.map((inst) => (inst.id === id ? { ...inst, ...fields } : inst))
    setStored('neurolearn_institutions', updated)
    return updated.find((inst) => inst.id === id)
  },
}

export const assessmentService = {
  getAll: async () => {
    await delay(400)
    return getStored('neurolearn_assessments', INITIAL_ASSESSMENTS)
  },

  create: async (assessment) => {
    await delay(600)
    const list = getStored('neurolearn_assessments', INITIAL_ASSESSMENTS)
    const newAssessment = {
      id: `A${String(list.length + 1).padStart(3, '0')}`,
      score: assessment.score || null,
      risk: assessment.risk || null,
      date: assessment.date || new Date().toISOString().split('T')[0],
      ...assessment,
    }
    const updated = [newAssessment, ...list]
    setStored('neurolearn_assessments', updated)
    return newAssessment
  },
}

export const analyticsService = {
  getTrends: async () => {
    await delay(400)
    return [
      { month: 'May', dyslexia: 18, adhd: 12, reading: 22 },
      { month: 'Jun', dyslexia: 20, adhd: 14, reading: 19 },
      { month: 'Jul', dyslexia: 17, adhd: 11, reading: 21 },
      { month: 'Aug', dyslexia: 22, adhd: 16, reading: 24 },
      { month: 'Sep', dyslexia: 19, adhd: 13, reading: 20 },
      { month: 'Oct', dyslexia: 21, adhd: 15, reading: 18 },
    ]
  },

  getRegionalData: async () => {
    await delay(300)
    return [
      { region: 'North', schools: 12, students: 4200, riskRate: 15 },
      { region: 'South', schools: 10, students: 3800, riskRate: 22 },
      { region: 'East', schools: 8, students: 2900, riskRate: 18 },
      { region: 'West', schools: 12, students: 1582, riskRate: 14 },
    ]
  },
}

export const reportsService = {
  getAll: async () => {
    await delay(450)
    return getStored('neurolearn_reports', INITIAL_REPORTS)
  },

  create: async (report) => {
    await delay(500)
    const list = getStored('neurolearn_reports', INITIAL_REPORTS)
    const newReport = {
      id: `R${String(list.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'generating',
      ...report,
    }
    const updated = [newReport, ...list]
    setStored('neurolearn_reports', updated)

    // Simulate background report generation job
    setTimeout(() => {
      const currentList = getStored('neurolearn_reports', INITIAL_REPORTS)
      const finalized = currentList.map((r) =>
        r.id === newReport.id ? { ...r, status: 'ready' } : r
      )
      setStored('neurolearn_reports', finalized)

      // Inject system-level notification
      const storedNotifs = localStorage.getItem('neurolearn_notifications')
      const currentNotifs = storedNotifs ? JSON.parse(storedNotifs) : []
      const newNotif = {
        id: Date.now(),
        type: 'success',
        message: `Report "${newReport.title}" is ready for download`,
        read: false,
        time: 'Just now',
      }
      localStorage.setItem('neurolearn_notifications', JSON.stringify([newNotif, ...currentNotifs]))
    }, 4000)

    return newReport
  },

  update: async (id, fields) => {
    const list = getStored('neurolearn_reports', INITIAL_REPORTS)
    const updated = list.map((r) => (r.id === id ? { ...r, ...fields } : r))
    setStored('neurolearn_reports', updated)
    return updated.find((r) => r.id === id)
  },
}
