export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export function sendPushNotification(data: {
  title: string
  body: string
  icon?: string
}) {
  if (typeof window === 'undefined' || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  try {
    new Notification(data.title, {
      body: data.body,
      icon: data.icon ?? '/logos/Corex_Logo_icon.png',
      badge: '/logos/Corex_Logo_icon.png',
    })
  } catch {
    /* notification API may throw in some embeddings */
  }
}
