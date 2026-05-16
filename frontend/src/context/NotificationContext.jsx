import { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((type, message, duration = 5000) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, message }])
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, duration)
    }
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const notifySuccess = useCallback((message, duration) => {
    addNotification('success', message, duration)
  }, [addNotification])

  const notifyError = useCallback((message, duration) => {
    addNotification('error', message, duration)
  }, [addNotification])

  const notifyWarning = useCallback((message, duration) => {
    addNotification('warning', message, duration)
  }, [addNotification])

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyWarning }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function NotificationToast({ type, message, onClose }) {
  const styles = {
    success: 'bg-emerald-500/90 border-emerald-400 text-white',
    error: 'bg-red-500/90 border-red-400 text-white',
    warning: 'bg-amber-500/90 border-amber-400 text-white',
    info: 'bg-blue-500/90 border-blue-400 text-white'
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border rounded-lg shadow-lg backdrop-blur-sm min-w-[300px] pointer-events-auto animate-slide-in",
        styles[type] || styles.info
      )}
    >
      <span className="text-sm font-medium flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
