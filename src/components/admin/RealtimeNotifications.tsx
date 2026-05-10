'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  requestPushPermission,
  sendPushNotification,
} from '@/lib/notifications/push'

type NotifItem = {
  id: string
  name: string
  service: string
  time: string
}

const SERVICE_LABELS: Record<string, string> = {
  digitalisation: 'Digitalisation',
  saas: 'SaaS Builder',
  other: 'Autre',
}

export default function RealtimeNotifications() {
  const locale = useLocale()
  const [newCount, setNewCount] = useState(0)
  const [notifications, setNotifications] = useState<NotifItem[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [pushOk, setPushOk] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushOk(Notification.permission === 'granted')
    } else {
      setPushOk(false)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('reservations-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload) => {
          const r = payload.new as {
            id: string
            contact_name: string
            service: string
          }
          setNewCount((c) => c + 1)
          setNotifications((prev) => [
            {
              id: r.id,
              name: r.contact_name,
              service: r.service,
              time: new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
            ...prev,
          ].slice(0, 10))
          sendPushNotification({
            title: '🔔 Nouvelle réservation — Corex',
            body: `${r.contact_name} vient de prendre un RV`,
          })
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function activatePush() {
    const granted = await requestPushPermission()
    setPushOk(granted)
  }

  return (
    <>
      {pushOk === false && (
        <button
          type="button"
          onClick={activatePush}
          style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.4)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '6px',
            padding: '0.3rem 0.6rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          🔔 Activer notifs
        </button>
      )}

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => {
            setShowNotifs((s) => !s)
            setNewCount(0)
          }}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            color: 'inherit',
          }}
          aria-label="Notifications"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {newCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                background: '#EF4444',
                borderRadius: '50%',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #111',
              }}
            >
              {newCount > 9 ? '9+' : newCount}
            </span>
          )}
        </button>

        {showNotifs && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '320px',
              background: '#111',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              zIndex: 200,
            }}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                Notifications
              </span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                {notifications.length === 0
                  ? 'Aucune'
                  : `${notifications.length} récentes`}
              </span>
            </div>

            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.82rem',
                }}
              >
                Aucune nouvelle notification
              </div>
            ) : (
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#01EA62',
                        marginTop: '5px',
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#fff',
                          marginBottom: '2px',
                        }}
                      >
                        Nouvelle réservation
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {notif.name} — {SERVICE_LABELS[notif.service] ?? notif.service}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'rgba(255,255,255,0.3)',
                          marginTop: '2px',
                        }}
                      >
                        {notif.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <Link
                href={`/${locale}/admin/reservations`}
                style={{
                  fontSize: '0.78rem',
                  color: '#01EA62',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
                onClick={() => setShowNotifs(false)}
              >
                Voir toutes les réservations →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
