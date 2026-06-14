// ─────────────────────────────────────────────
// Mock service layer — replace with real API calls
// All functions return Promises to simulate async behaviour
// ─────────────────────────────────────────────

export const dashboardService = {
  getStats: () =>
    Promise.resolve({
      totalStudents: 12482,
      studentsTrend: '+12%',
      riskPrevalence: 18.5,
      riskTrend: '+2.4%',
      completedScreenings: 8902,
      screeningsTrend: '+5%',
      activeInstitutions: 42,
    }),

  getPerformanceDistribution: () =>
    Promise.resolve([
      { grade: 'Grade 1', mastery: 160, progressing: 48, atRisk: 32 },
      { grade: 'Grade 2', mastery: 128, progressing: 80, atRisk: 48 },
      { grade: 'Grade 3', mastery: 176, progressing: 40, atRisk: 24 },
      { grade: 'Grade 4', mastery: 112, progressing: 96, atRisk: 64 },
      { grade: 'Grade 5', mastery: 208, progressing: 32, atRisk: 16 },
    ]),

  getRiskTypology: () =>
    Promise.resolve([
      { name: 'Phonological', value: 58, color: '#3525cd' },
      { name: 'Rapid Naming', value: 24, color: '#00687a' },
      { name: 'Visual Processing', value: 18, color: '#ba1a1a' },
    ]),

  getInstitutions: () =>
    Promise.resolve([
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
      },
    ]),
}

export const assessmentService = {
  getAll: () =>
    Promise.resolve([
      { id: 'A001', student: 'Emma Johnson', type: 'Reading', status: 'completed', score: 92, risk: 'low', date: '2023-10-24' },
      { id: 'A002', student: 'Liam Chen', type: 'Voice', status: 'in-progress', score: null, risk: 'moderate', date: '2023-10-25' },
      { id: 'A003', student: 'Sophia Patel', type: 'Typing', status: 'completed', score: 67, risk: 'high', date: '2023-10-23' },
      { id: 'A004', student: 'Noah Kim', type: 'Eye Tracking', status: 'scheduled', score: null, risk: null, date: '2023-10-26' },
      { id: 'A005', student: 'Ava Martinez', type: 'Reading', status: 'completed', score: 88, risk: 'low', date: '2023-10-22' },
      { id: 'A006', student: 'Ethan Brown', type: 'Voice', status: 'completed', score: 55, risk: 'high', date: '2023-10-21' },
    ]),
}

export const analyticsService = {
  getTrends: () =>
    Promise.resolve([
      { month: 'May', dyslexia: 18, adhd: 12, reading: 22 },
      { month: 'Jun', dyslexia: 20, adhd: 14, reading: 19 },
      { month: 'Jul', dyslexia: 17, adhd: 11, reading: 21 },
      { month: 'Aug', dyslexia: 22, adhd: 16, reading: 24 },
      { month: 'Sep', dyslexia: 19, adhd: 13, reading: 20 },
      { month: 'Oct', dyslexia: 21, adhd: 15, reading: 18 },
    ]),

  getRegionalData: () =>
    Promise.resolve([
      { region: 'North', schools: 12, students: 4200, riskRate: 15 },
      { region: 'South', schools: 10, students: 3800, riskRate: 22 },
      { region: 'East', schools: 8, students: 2900, riskRate: 18 },
      { region: 'West', schools: 12, students: 1582, riskRate: 14 },
    ]),
}

export const reportsService = {
  getAll: () =>
    Promise.resolve([
      { id: 'R001', title: 'Q3 District Report', type: 'district', createdAt: '2023-10-01', status: 'ready' },
      { id: 'R002', title: 'Lincoln Elementary — October', type: 'institution', createdAt: '2023-10-15', status: 'ready' },
      { id: 'R003', title: 'Emma Johnson — Full Assessment', type: 'student', createdAt: '2023-10-24', status: 'generating' },
    ]),
}
