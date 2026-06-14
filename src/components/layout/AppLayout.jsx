import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { InsightsPanel } from '../ui/InsightsPanel'
import { ErrorBoundary } from '../ui'

export function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#f8f9ff' }}>
      <Sidebar />
      <div className="flex flex-col flex-1" style={{ marginLeft: '256px' }}>
        <TopBar />
        <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <InsightsPanel />
    </div>
  )
}

function Footer() {
  return (
    <footer
      className="py-8 px-8 border-t"
      style={{ borderColor: 'rgba(199,196,216,0.3)', background: '#eff4ff' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <h4 className="font-bold" style={{ color: '#3525cd', fontSize: 16 }}>
            NeuroLearn AI
          </h4>
          <p style={{ fontSize: 12, color: '#464555', marginTop: 4 }}>
            Empowering Educators with Neural Insights.
          </p>
        </div>
        <div className="flex gap-8" style={{ fontSize: 12, color: '#464555' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: '#464555', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.target.style.color = '#3525cd')}
              onMouseLeave={(e) => (e.target.style.color = '#464555')}
            >
              {link}
            </a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#464555' }}>© 2024 NeuroLearn AI. All rights reserved.</p>
      </div>
    </footer>
  )
}
