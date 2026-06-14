import { useState } from 'react'
import { Search, Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

export function TopBar() {
  const [query, setQuery] = useState('')
  const { unreadCount } = useNotifications()

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
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-full w-96"
        style={{ background: '#eff4ff' }}
      >
        <Search size={18} color="#464555" />
        <input
          type="text"
          placeholder="Search students, classes, or reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-none outline-none w-full"
          style={{ fontSize: 16, color: '#0b1c30' }}
        />
      </div>

      {/* Right Zone */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          className="relative rounded-full p-2 transition-all"
          style={{ transition: 'background 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#dce9ff')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={22} color="#0b1c30" />
          {unreadCount > 0 && (
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: '#ba1a1a' }}
            />
          )}
        </button>

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
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: '#3525cd', fontSize: 16 }}
          >
            SC
          </div>
        </div>
      </div>
    </header>
  )
}
