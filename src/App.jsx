import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AppStateProvider, ToastProvider, LoadingSpinner } from './components/ui'

const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })))
const AssessmentsPage = lazy(() => import('./pages/Assessments/AssessmentsPage').then(module => ({ default: module.AssessmentsPage })))
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage').then(module => ({ default: module.ReportsPage })))
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })))
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage').then(module => ({ default: module.ProfilePage })))

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size={48} />
          </div>
        }>
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
        </Suspense>
      </ToastProvider>
    </AppStateProvider>
  )
}
