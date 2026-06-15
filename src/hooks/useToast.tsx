import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  notify: (message: string, type?: Notification['type']) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = nextId++
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  const remove = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
        maxWidth: 360,
      }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => remove(n.id)}
            style={{
              padding: '10px 16px', borderRadius: 8,
              background: n.type === 'success' ? '#0F2A1C' : n.type === 'error' ? '#2A0F0F' : '#1A1F2E',
              border: `1px solid ${
                n.type === 'success' ? 'rgba(76,195,138,0.3)' :
                n.type === 'error' ? 'rgba(217,74,58,0.3)' : 'rgba(59,196,232,0.3)'
              }`,
              color: n.type === 'success' ? '#4CC38A' : n.type === 'error' ? '#D94A3A' : '#3BC4E8',
              fontSize: 12.5, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              animation: 'fade-in 0.2s ease',
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
