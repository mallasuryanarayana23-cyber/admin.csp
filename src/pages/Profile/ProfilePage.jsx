import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, Building2, Shield, Lock, History, Bell, ChevronRight, Save, Camera, Eye, EyeOff, X, ShieldCheck, RotateCw
} from 'lucide-react'
import { GlassCard, useToast, useAppState } from '../../components/ui'

const profileSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
  role: z.string(),
  institution: z.string().min(3, 'Required'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const orgSchema = z.object({
  name: z.string().min(3, 'Organization name must be at least 3 characters'),
  id: z.string().min(3, 'Required ID'),
  region: z.string().min(2, 'Required Region'),
  billingPlan: z.string(),
  contactEmail: z.string().email('Invalid email address'),
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
  const { profile, updateProfile } = useAppState()
  const { addToast } = useToast()

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      institution: profile.institution,
    },
  })

  const onSubmit = (data) => {
    updateProfile(data)
    addToast('Personal details updated successfully!', 'success')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      {/* Avatar */}
      <div className="flex items-center gap-6 p-6 rounded-2xl" style={{ background: '#eff4ff' }}>
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white bg-indigo-600"
            style={{ fontSize: 28 }}
          >
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center bg-indigo-600 border-2 border-white cursor-pointer"
          >
            <Camera size={14} color="white" />
          </button>
        </div>
        <div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Dr. {profile.firstName} {profile.lastName}</p>
          <p style={{ fontSize: 14, color: '#464555' }}>{profile.role} · {profile.institution}</p>
          <p style={{ fontSize: 12, color: '#3525cd', marginTop: 4, cursor: 'pointer' }}>Change avatar</p>
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

function OrganizationTab() {
  const { profile, updateProfile } = useAppState()
  const { addToast } = useToast()

  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: profile.organization.name,
      id: profile.organization.id,
      region: profile.organization.region,
      billingPlan: profile.organization.billingPlan,
      contactEmail: profile.organization.contactEmail,
    },
  })

  const onSubmit = async (data) => {
    updateProfile({ organization: data })
    addToast('Organization settings updated successfully!', 'success')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div className="border-b pb-4 mb-4">
        <h4 className="text-lg font-bold text-slate-800">Organization Settings</h4>
        <p className="text-sm text-slate-500 mt-1">Manage institutional scopes, metadata, and licensing metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Organization Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Institution ID */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">System ID</label>
          <input
            type="text"
            {...register('id')}
            disabled
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm font-mono"
          />
        </div>

        {/* Region */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Region Focus</label>
          <input
            type="text"
            {...register('region')}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm"
          />
          {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region.message}</p>}
        </div>

        {/* Subscription Tier */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Billing / Subscription Tier</label>
          <input
            type="text"
            {...register('billingPlan')}
            disabled
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm font-semibold"
          />
        </div>

        {/* Contact Email */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Administrative Contact Email</label>
          <input
            type="email"
            {...register('contactEmail')}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm"
          />
          {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isDirty || isSubmitting}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? <RotateCw size={15} className="animate-spin" /> : <Save size={16} />}
        Save Organization Settings
      </button>
    </form>
  )
}

function SecurityTab() {
  const [showPw, setShowPw] = useState(false)
  const [twoFa, setTwoFa] = useState(false)
  const [showTwoFaModal, setShowTwoFaModal] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const { addToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handlePasswordSubmit = async () => {
    // Simulate updating password
    await new Promise((resolve) => setTimeout(resolve, 800))
    addToast('Account password updated successfully!', 'success')
    reset()
  }

  const handleTwoFaToggle = () => {
    if (!twoFa) {
      // Prompt verification modal before activation
      setShowTwoFaModal(true)
    } else {
      setTwoFa(false)
      addToast('Two-Factor Authentication disabled', 'warning')
    }
  }

  const handleVerifyTotp = () => {
    if (totpCode.length === 6 && /^\d+$/.test(totpCode)) {
      setTwoFa(true)
      setShowTwoFaModal(false)
      setTotpCode('')
      addToast('Two-Factor Authentication successfully configured!', 'success')
    } else {
      addToast('Please enter a valid 6-digit numeric verification code.', 'error')
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Password */}
      <GlassCard style={{ padding: 24 }}>
        <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Change Password</h4>
        <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
          {['currentPassword', 'newPassword', 'confirmPassword'].map((key) => {
            const labelMap = {
              currentPassword: 'Current Password',
              newPassword: 'New Password',
              confirmPassword: 'Confirm Password',
            }
            return (
              <div key={key}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#464555', display: 'block', marginBottom: 6 }}>
                  {labelMap[key]}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    {...register(key)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 14px',
                      border: errors[key] ? '1px solid #ba1a1a' : '1px solid #c7c4d8',
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
                {errors[key] && (
                  <p style={{ fontSize: 12, color: '#ba1a1a', marginTop: 4 }}>{errors[key].message}</p>
                )}
              </div>
            )
          })}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting && <RotateCw size={14} className="animate-spin mr-1.5" />}
            Update Password
          </button>
        </form>
      </GlassCard>

      {/* 2FA */}
      <GlassCard style={{ padding: 24 }}>
        <div className="flex justify-between items-start">
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 600 }}>Two-Factor Authentication (2FA)</h4>
            <p style={{ fontSize: 14, color: '#464555', marginTop: 4 }}>
              Protect your educator access credentials using 2FA TOTP web tokens.
            </p>
          </div>
          <button
            onClick={handleTwoFaToggle}
            className="relative cursor-pointer"
            style={{
              width: 48,
              height: 26,
              borderRadius: 13,
              background: twoFa ? '#3525cd' : '#c7c4d8',
              border: 'none',
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

      {/* 2FA Setup verification Modal */}
      <AnimatePresence>
        {showTwoFaModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
                  <ShieldCheck className="text-indigo-600" size={20} />
                  Configure 2FA Auth
                </span>
                <button
                  onClick={() => setShowTwoFaModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-500">
                  Scan this QR code using Google Authenticator, Authy, or your password manager.
                </p>

                {/* Mock QR Code */}
                <div className="w-40 h-40 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center border border-slate-200 font-mono text-[9px] text-slate-400 p-4 text-center">
                  [MOCK QR CODE: neurolearn_ sarah_chen_totp]
                </div>

                <div className="text-left">
                  <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase">6-Digit verification code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none text-center font-mono font-bold text-lg focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  onClick={() => setShowTwoFaModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 border rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyTotp}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Verify & Activate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PermissionsTab() {
  const PERMISSIONS_MATRIX = [
    { module: 'Dashboard Metrics', admin: true, specialist: true, observer: true },
    { module: 'Run Screenings / Create Assessments', admin: true, specialist: true, observer: false },
    { module: 'Edit / Delete Assessments', admin: true, specialist: false, observer: false },
    { module: 'Generate AI Diagnostics Reports', admin: true, specialist: true, observer: false },
    { module: 'Share Reports Externally', admin: true, specialist: false, observer: false },
    { module: 'Manage SIS Credentials & Integrations', admin: true, specialist: false, observer: false },
    { module: 'Change User Permissions & Roles', admin: true, status: 'root-locked', specialist: false, observer: false },
  ]

  return (
    <div className="space-y-4 text-left">
      <div className="border-b pb-4">
        <h4 className="text-lg font-bold text-slate-800">Role-Based Access Control (RBAC)</h4>
        <p className="text-sm text-slate-500 mt-1">Review active system authorizations mapped to your organizational user roles.</p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-xs uppercase">
              <th className="p-4">Module capability</th>
              <th className="p-4 text-center">Admin</th>
              <th className="p-4 text-center">Specialist</th>
              <th className="p-4 text-center">Observer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {PERMISSIONS_MATRIX.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-700">{p.module}</td>
                <td className="p-4 text-center">
                  {p.admin ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-red-400 font-bold">✕</span>}
                </td>
                <td className="p-4 text-center">
                  {p.specialist ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-red-400 font-bold">✕</span>}
                </td>
                <td className="p-4 text-center">
                  {p.observer ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-red-400 font-bold">✕</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100">
        Your current user is registered under the <strong className="text-slate-600">Administrator</strong> role, granting complete system read/write authorizations. Override permission controls require root network validation.
      </p>
    </div>
  )
}

function PreferencesTab() {
  const { profile, updateProfile } = useAppState()
  const { addToast } = useToast()

  const [emailDigest, setEmailDigest] = useState(profile.preferences.emailDigest)
  const [smsAlerts, setSmsAlerts] = useState(profile.preferences.smsAlerts)
  const [theme, setTheme] = useState(profile.preferences.theme)
  const [defaultLanding, setDefaultLanding] = useState(profile.preferences.defaultLanding)

  // Sync theme changes to html class
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    
    let isDark = false
    if (newTheme === 'dark') {
      isDark = true
    } else if (newTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    document.documentElement.classList.toggle('dark', isDark)
    
    // Customize page surface colors if in dark mode
    if (isDark) {
      document.body.style.backgroundColor = '#0b1c30'
      document.body.style.color = '#f8f9ff'
    } else {
      document.body.style.backgroundColor = '#f8f9ff'
      document.body.style.color = '#0b1c30'
    }

    addToast(`Theme preference updated to ${newTheme}`, 'success')
  }

  const handleSave = () => {
    updateProfile({
      preferences: {
        emailDigest,
        smsAlerts,
        theme,
        defaultLanding,
      }
    })
    addToast('Portal preferences saved successfully!', 'success')
  }

  return (
    <div className="space-y-6 text-left">
      <div className="border-b pb-4 mb-4">
        <h4 className="text-lg font-bold text-slate-800">Portal Preferences</h4>
        <p className="text-sm text-slate-500 mt-1">Configure layout, notification feeds, and alert alerts.</p>
      </div>

      <div className="space-y-4">
        {/* Email Digest */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Weekly Email Diagnostics Digest</label>
          <select
            value={emailDigest}
            onChange={(e) => setEmailDigest(e.target.value)}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm bg-white"
          >
            <option value="realtime">Real-time alerts</option>
            <option value="daily">Daily summary</option>
            <option value="weekly">Weekly digest</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* SMS Alerts toggle */}
        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border">
          <div>
            <p className="text-sm font-semibold text-slate-700">SMS Alerts on Critical Risk Alerts</p>
            <p className="text-xs text-slate-400">Receive text alerts when AI detects critical learning difficulties.</p>
          </div>
          <button
            onClick={() => setSmsAlerts(!smsAlerts)}
            className="relative cursor-pointer"
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: smsAlerts ? '#3525cd' : '#c7c4d8',
              border: 'none',
              transition: 'background 0.2s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: smsAlerts ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </button>
        </div>

        {/* Theme Select */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Theme Selection</label>
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm bg-white"
          >
            <option value="light">Light Mode (Default)</option>
            <option value="dark">Dark Mode</option>
            <option value="system">Follow System Settings</option>
          </select>
        </div>

        {/* Default Landing Page */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Default Landing Page</label>
          <select
            value={defaultLanding}
            onChange={(e) => setDefaultLanding(e.target.value)}
            className="w-full px-3.5 py-2 border rounded-xl border-slate-200 outline-none focus:border-indigo-500 text-sm bg-white"
          >
            <option value="/dashboard">Dashboard</option>
            <option value="/assessments">Assessments</option>
            <option value="/reports">Reports</option>
            <option value="/analytics">Analytics</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="btn-primary flex items-center gap-2 mt-6"
      >
        <Save size={16} />
        Save Preferences
      </button>
    </div>
  )
}

function AuditLogsTab() {
  return (
    <div className="space-y-3 text-left">
      <div className="border-b pb-4 mb-4">
        <h4 className="text-lg font-bold text-slate-800">Security Audit Logs</h4>
        <p className="text-sm text-slate-500 mt-1">Review chronological list of logins and administrative actions.</p>
      </div>

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
            className="px-2 py-0.5 rounded-full text-xs font-bold font-mono"
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
      case 'organization': return <OrganizationTab />
      case 'security': return <SecurityTab />
      case 'permissions': return <PermissionsTab />
      case 'preferences': return <PreferencesTab />
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
        <GlassCard style={{ padding: 8, width: 220, height: 'fit-content', flexShrink: 0 }} className="hidden md:block">
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
