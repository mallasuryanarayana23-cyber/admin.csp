import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Plus,
  Brain,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help' },
]

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col py-6 shadow-sm z-50"
      style={{
        width: 256,
        background: '#ffffff',
        borderRight: '1px solid rgba(199,196,216,0.25)',
      }}
    >
      {/* Brand */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#3525cd' }}
          >
            <Brain size={18} color="#fff" />
          </div>
          <h1 className="font-bold" style={{ fontSize: 20, color: '#3525cd' }}>
            NeuroLearn
          </h1>
        </div>
        <p style={{ fontSize: 12, color: '#464555', marginLeft: 40 }}>Educator Portal</p>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* New Screening CTA */}
      <div className="px-6 py-4">
        <button className="btn-primary w-full">
          <Plus size={18} />
          New Screening
        </button>
      </div>

      {/* Bottom Nav */}
      <div
        className="px-2 border-t pt-3"
        style={{ borderColor: 'rgba(199,196,216,0.25)' }}
      >
        {BOTTOM_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="nav-item"
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}
