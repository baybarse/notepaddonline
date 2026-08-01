import { useState, useEffect, useCallback, useRef } from 'react'
import { Wifi, WifiOff, Cloud, CloudOff, Check, Loader } from 'lucide-react'

const QUEUE_KEY = 'padsync_offline_queue'

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncState, setSyncState] = useState('synced') // 'synced' | 'syncing' | 'pending' | 'error'
  const [pendingCount, setPendingCount] = useState(0)
  const queueRef = useRef([])

  // Load queue from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
      queueRef.current = saved
      setPendingCount(saved.length)
      if (saved.length > 0) setSyncState('pending')
    } catch { /* ignore */ }
  }, [])

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      if (syncState === 'synced') setSyncState('pending')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [syncState])

  // Queue an operation for offline
  const queueOperation = useCallback((operation) => {
    queueRef.current.push({
      ...operation,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queueRef.current))
    setPendingCount(queueRef.current.length)
    setSyncState('pending')
  }, [])

  // Process queue when back online
  const processQueue = useCallback(async (supabase) => {
    if (queueRef.current.length === 0) return
    setSyncState('syncing')

    const failedOps = []

    for (const op of queueRef.current) {
      try {
        if (op.type === 'update_note') {
          await supabase.from('notes')
            .update({ ...op.data, updated_at: new Date().toISOString() })
            .eq('id', op.noteId)
        } else if (op.type === 'delete_note') {
          await supabase.from('notes')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', op.noteId)
        }
      } catch {
        failedOps.push(op)
      }
    }

    queueRef.current = failedOps
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failedOps))
    setPendingCount(failedOps.length)
    setSyncState(failedOps.length > 0 ? 'error' : 'synced')
  }, [])

  // Mark as syncing
  const markSyncing = useCallback(() => {
    setSyncState('syncing')
  }, [])

  // Mark as synced
  const markSynced = useCallback(() => {
    if (queueRef.current.length === 0) {
      setSyncState('synced')
    }
  }, [])

  // Mark error
  const markError = useCallback(() => {
    setSyncState('error')
  }, [])

  return {
    isOnline, syncState, pendingCount,
    queueOperation, processQueue,
    markSyncing, markSynced, markError,
  }
}

export default function SyncIndicator({ isOnline, syncState, pendingCount }) {
  const getIcon = () => {
    if (!isOnline) return <WifiOff size={14} />
    switch (syncState) {
      case 'syncing': return <Loader size={14} className="sync-spinner" />
      case 'pending': return <CloudOff size={14} />
      case 'error': return <CloudOff size={14} />
      default: return <Check size={14} />
    }
  }

  const getLabel = () => {
    if (!isOnline) return 'Offline'
    switch (syncState) {
      case 'syncing': return 'Syncing...'
      case 'pending': return `${pendingCount} pending`
      case 'error': return 'Sync error'
      default: return 'Synced'
    }
  }

  const getClass = () => {
    if (!isOnline) return 'sync-offline'
    switch (syncState) {
      case 'syncing': return 'sync-syncing'
      case 'pending': return 'sync-pending'
      case 'error': return 'sync-error'
      default: return 'sync-synced'
    }
  }

  return (
    <div className={`sync-indicator ${getClass()}`}>
      {getIcon()}
      <span>{getLabel()}</span>
    </div>
  )
}
