import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, Building2, Shield, Lock, History, Bell, ChevronRight, Save, Camera, Eye, EyeOff,
} from 'lucide-react'
import { GlassCard } from '../../components/ui'

const profileSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.string(),
  institution: z.string().min(3, 'Required'),
})

const TABS = [
  { id: 'personal', label: 'Personal Details', icon: <User size={18} /> },
  { id: 'organization', label: 'Organization', icon: <Building2 size={18} /> },
  { id: 'security', label: 'Security & 2FA', icon: <Lock size={18} /> },
  { id: 'permissions', label: 'Permissions', icon: <Shield size={18} /> },
  { id: 'audit', label: 'Audit Logs', icon: <History size={18} /> },
  { id: 'preferences', label: 'Preferences', icon: <Bell size={18} /> },
]

const AUDIT_LOGS = [
  { action: 'Login from Chrome on Windows', time: 'Oct 25, 2023 · 09:42 AM', status: 'success' },
  { action: 'Exported Q3 District Report', time: 'Oct 24, 2023 · 03:15 PM', status: 'success' },
  { action: 'Failed login attempt', time: 'Oct 23, 2023 · 11:02 AM', status: 'failed' },
  { action: 'Updated profile email', time: 'Oct 22, 2023 · 02:30 PM', status: 'success' },
  { action: 'Created new assessment batch', time: 'Oct 21, 2023 · 10:00 AM', status: 'success' },
]

function PersonalDetailsTab() {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.chen@neurolearn.edu',
      phone: '+1 555 012 3456',
      role: 'Administrator',
      institution: 'Lincoln Unified School District',
    },
  })

  const onSubmit = (data) => console.log('Profile updated:', data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: '#eff4ff' }}>
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: '#3525cd', fontSize: 28 }}
          >
            SC
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: '#3525cd' }}
          >
            <Camera size={14} color="white" />
          </button>
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Dr. Sarah Chen</p>
          <p style={{ fontSize: 14, color: '#464555' }}>Administrator · Lincoln Unified School District</p>
          <p style={{ fontSize: 12, color: '#3525cd', marginTop: 4 }}>Change avatar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'First Name', key: 'firstName' },
          { label: 'Last Name', key: 'lastName' },
          { label: 'Email Address', key: 'email', type: 'email' },
          { label: 'Phone Number', key: 'phone', type: 'tel' },
          { label: 'Role', key: 'role' },
          { label: 'Institution', key: 'institution' },
        ].map(({ label, key, type = 'text' }) => (
          <div key={key}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#464555', display: 'block', marginBottom: 6 }}>
              {label}
            </label>
            <input
              type={type}
              {...register(key)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: errors[key] ? '1px solid #ba1a1a' : '1px solid #c7c4d8',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                background: '#fff',
                color: '#0b1c30',
              }}
            />
            {errors[key] && (
              <p style={{ fontSize: 12, color: '#ba1a1a', marginTop: 4 }}>{errors[key].message}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="btn-primary flex items-center gap-2"
        disabled={!isDirty}
        style={{ opacity: isDirty ? 1 : 0.6 }}
      >
        <Save size={16} />
        Save Changes
      </button>
    </form>
  )
}

function SecurityTab() {
  const [showPw, setShowPw] = useState(false)
  const [twoFa, setTwoFa] = useState(false)

  return (
    <div className="space-y-6">
      {/* Password */}
      <GlassCard style={{ padding: 24 }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Change Password</h4>
        <div className="space-y-4">
          {['Current Password', 'New Password', 'Confirm Password'].map((label) => (
            <div key={label}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#464555', display: 'block', marginBottom: 6 }}>
                {label}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    border: '1px solid #c7c4d8',
                    borderRadius: 8,
                    fontSize: 15,
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#464555',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}
          <button className="btn-primary">Update Password</button>
        </div>
      </GlassCard>

      {/* 2FA */}
      <GlassCard style={{ padding: 24 }}>
        <div className="flex justify-between items-start">
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 600 }}>Two-Factor Authentication</h4>
            <p style={{ fontSize: 14, color: '#464555', marginTop: 4 }}>
              Add an extra layer of security to your account.
            </p>
          </div>
          <button
            onClick={() => setTwoFa((v) => !v)}
            className="relative"
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: twoFa ? '#3525cd' : '#c7c4d8',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: twoFa ? 24 : 3,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>
      </GlassCard>
    </div>
  )
}

function AuditLogsTab() {
  return (
    <div className="space-y-3">
      {AUDIT_LOGS.map((log, i) => (
        <motion.div
          key={i}
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: '#eff4ff' }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: log.status === 'success' ? '#10B981' : '#ba1a1a' }}
            />
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{log.action}</p>
              <p style={{ fontSize: 12, color: '#464555' }}>{log.time}</p>
            </div>
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: log.status === 'success' ? 'rgba(16,185,129,0.1)' : '#ffdad6',
              color: log.status === 'success' ? '#10B981' : '#ba1a1a',
            }}
          >
            {log.status.toUpperCase()}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalDetailsTab />
      case 'security': return <SecurityTab />
      case 'audit': return <AuditLogsTab />
      default:
        return (
          <div className="py-16 text-center" style={{ color: '#464555', fontSize: 15 }}>
            {TABS.find((t) => t.id === activeTab)?.label} — coming soon.
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#0b1c30' }}>Profile & Settings</h2>
        <p style={{ fontSize: 16, color: '#464555', marginTop: 4 }}>
          Manage your account, security, and platform preferences.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Side Nav */}
        <GlassCard style={{ padding: 8, width: 220, height: 'fit-content', flexShrink: 0 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all"
              style={{
                background: activeTab === tab.id ? '#3525cd' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#464555',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
              }}
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
              <ChevronRight size={14} />
            </button>
          ))}
        </GlassCard>

        {/* Content */}
        <GlassCard style={{ padding: 28, flex: 1 }}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </GlassCard>
      </div>
    </div>
  )
}
