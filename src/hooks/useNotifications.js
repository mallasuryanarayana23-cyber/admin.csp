import { useEffect, useRef } from 'react'
import { useAppState } from '../components/ui/AppStateProvider'
import { useToast } from '../components/ui/ToastProvider'

const MOCK_ALERTS = [
  { type: 'alert', message: 'Risk Alert: Attention Deficit detected in Grade 3 (Sector A)' },
  { type: 'info', message: 'New teacher registered: Lincoln Elementary' },
  { type: 'success', message: 'Reading Assessment synced for Ava Martinez' },
  { type: 'alert', message: 'Risk Alert: High dyslexia probability - Liam Chen' },
  { type: 'info', message: 'System Update: Core AI diagnostic model updated to v2.4' },
]

export function useNotifications() {
  const {
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useAppState()

  const { addToast } = useToast()
  const intervalRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Background activity simulation
  useEffect(() => {
    // Prevent duplicate registrations
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      // Pick a random alert
      const randomAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)]
      
      addNotification({
        type: randomAlert.type,
        message: randomAlert.message,
      })

      // Alert types map to toast types
      const toastType = randomAlert.type === 'alert' ? 'warning' : randomAlert.type

      addToast(randomAlert.message, toastType)
    }, 45000) // 45 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [addNotification, addToast])

  return {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  }
}
