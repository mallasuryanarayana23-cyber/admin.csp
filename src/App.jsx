import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { AssessmentsPage } from './pages/Assessments/AssessmentsPage'
import { ReportsPage } from './pages/Reports/ReportsPage'
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage'
import { ProfilePage } from './pages/Profile/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}
