import { useState } from 'react'

export function useNotifications() {
  const [notifications] = useState([
    { id: 1, type: 'alert', message: 'Risk Alert: Grade 4 (Sector B)', read: false },
    { id: 2, type: 'info', message: 'New teacher signup: Washington JH', read: false },
    { id: 3, type: 'success', message: 'Screening batch completed for Lincoln Elementary', read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, unreadCount }
}
