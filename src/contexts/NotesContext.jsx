import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const { user } = useAuth()
  const [folders, setFolders] = useState([])
  const [notes, setNotes] = useState([])
  const [trashedNotes, setTrashedNotes] = useState([])
  const [trashedFolders, setTrashedFolders] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sync status
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncState, setSyncState] = useState('synced') // 'synced' | 'syncing' | 'pending' | 'error'
  const [pendingCount, setPendingCount] = useState(0)
  const offlineQueueRef = useRef([])
  const QUEUE_KEY = 'padsync_offline_queue'

  const activeNote = notes.find(n => n.id === activeNoteId) || null

  // Load offline queue
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')
      offlineQueueRef.current = saved
      setPendingCount(saved.length)
      if (saved.length > 0) setSyncState('pending')
    } catch { /* ignore */ }
  }, [])

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Process queue when back online
      processOfflineQueue()
    }
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveQueue = useCallback(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(offlineQueueRef.current))
    setPendingCount(offlineQueueRef.current.length)
  }, [])

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueueRef.current.length === 0) return
    setSyncState('syncing')

    const failedOps = []
    for (const op of offlineQueueRef.current) {
      try {
        if (op.type === 'update_note') {
          await supabase.from('notes')
            .update({ ...op.data, updated_at: new Date().toISOString() })
            .eq('id', op.noteId)
        } else if (op.type === 'delete_note') {
          await supabase.from('notes')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', op.noteId)
        } else if (op.type === 'update_folder') {
          await supabase.from('folders')
            .update({ ...op.data, updated_at: new Date().toISOString() })
            .eq('id', op.folderId)
        }
      } catch {
        failedOps.push(op)
      }
    }

    offlineQueueRef.current = failedOps
    saveQueue()
    setSyncState(failedOps.length > 0 ? 'error' : 'synced')

    // Refresh data after processing queue
    if (failedOps.length === 0) {
      fetchData()
    }
  }, [saveQueue])

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [foldersRes, notesRes] = await Promise.all([
      supabase.from('folders').select('*').eq('user_id', user.id).is('deleted_at', null).order('name'),
      supabase.from('notes').select('*').eq('user_id', user.id).is('deleted_at', null).order('updated_at', { ascending: false }),
    ])

    if (foldersRes.data) setFolders(foldersRes.data)
    if (notesRes.data) setNotes(notesRes.data)
    setLoading(false)
  }, [user])

  const fetchTrash = useCallback(async () => {
    if (!user) return

    const [foldersRes, notesRes] = await Promise.all([
      supabase.from('folders').select('*').eq('user_id', user.id).not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
      supabase.from('notes').select('*').eq('user_id', user.id).not('deleted_at', 'is', null).order('deleted_at', { ascending: false }),
    ])

    if (foldersRes.data) setTrashedFolders(foldersRes.data)
    if (notesRes.data) setTrashedNotes(notesRes.data)
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // === FOLDER OPERATIONS ===

  const createFolder = async (name, parentId = null) => {
    if (!user) return null
    const { data, error } = await supabase
      .from('folders')
      .insert({ user_id: user.id, name, parent_id: parentId })
      .select()
      .single()

    if (error) {
      console.error('Create folder error:', error.message)
      throw error
    }
    setFolders(prev => [...prev, data])
    return data
  }

  const updateFolder = async (id, updates) => {
    if (!navigator.onLine) {
      // Queue for offline
      offlineQueueRef.current.push({ type: 'update_folder', folderId: id, data: updates, timestamp: Date.now() })
      saveQueue()
      setSyncState('pending')
      setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
      return { id, ...updates }
    }

    setSyncState('syncing')
    const { data, error } = await supabase
      .from('folders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update folder error:', error.message)
      setSyncState('error')
      throw error
    }
    setFolders(prev => prev.map(f => f.id === id ? data : f))
    setSyncState('synced')
    return data
  }

  const deleteFolder = async (id) => {
    const { error } = await supabase
      .from('folders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Delete folder error:', error.message)
      throw error
    }

    await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('folder_id', id)
      .eq('user_id', user.id)

    setFolders(prev => prev.filter(f => f.id !== id))
    setNotes(prev => prev.filter(n => n.folder_id !== id))
  }

  // === NOTE OPERATIONS ===

  const createNote = async (folderId = null) => {
    if (!user) return null
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        folder_id: folderId,
        title: 'Untitled Note',
        content: null,
        content_html: '',
      })
      .select()
      .single()

    if (error) {
      console.error('Create note error:', error.message)
      throw error
    }
    setNotes(prev => [data, ...prev])
    setActiveNoteId(data.id)
    return data
  }

  const updateNote = async (id, updates) => {
    if (!navigator.onLine) {
      // Queue for offline
      offlineQueueRef.current.push({ type: 'update_note', noteId: id, data: updates, timestamp: Date.now() })
      saveQueue()
      setSyncState('pending')
      // Optimistic update
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
      return { id, ...updates }
    }

    setSyncState('syncing')
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update note error:', error.message)
      setSyncState('error')
      throw error
    }
    setNotes(prev => prev.map(n => n.id === id ? data : n))
    setSyncState('synced')
    return data
  }

  const deleteNote = async (id) => {
    if (!navigator.onLine) {
      offlineQueueRef.current.push({ type: 'delete_note', noteId: id, timestamp: Date.now() })
      saveQueue()
      setSyncState('pending')
      setNotes(prev => prev.filter(n => n.id !== id))
      if (activeNoteId === id) setActiveNoteId(null)
      return
    }

    setSyncState('syncing')
    const { error } = await supabase
      .from('notes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Delete note error:', error.message)
      setSyncState('error')
      throw error
    }

    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNoteId === id) setActiveNoteId(null)
    setSyncState('synced')
  }

  const moveNote = async (noteId, folderId) => {
    return updateNote(noteId, { folder_id: folderId })
  }

  // === TRASH OPERATIONS ===

  const restoreNote = async (id) => {
    const { error } = await supabase
      .from('notes')
      .update({ deleted_at: null })
      .eq('id', id)

    if (error) throw error
    await fetchData()
    await fetchTrash()
  }

  const restoreFolder = async (id) => {
    const { error } = await supabase
      .from('folders')
      .update({ deleted_at: null })
      .eq('id', id)

    if (error) throw error

    await supabase
      .from('notes')
      .update({ deleted_at: null })
      .eq('folder_id', id)
      .eq('user_id', user.id)

    await fetchData()
    await fetchTrash()
  }

  const permanentDeleteNote = async (id) => {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) throw error
    setTrashedNotes(prev => prev.filter(n => n.id !== id))
  }

  const permanentDeleteFolder = async (id) => {
    await supabase.from('notes').delete().eq('folder_id', id)
    const { error } = await supabase.from('folders').delete().eq('id', id)
    if (error) throw error
    setTrashedFolders(prev => prev.filter(f => f.id !== id))
    setTrashedNotes(prev => prev.filter(n => n.folder_id !== id))
  }

  const emptyTrash = async () => {
    await supabase.from('notes').delete().eq('user_id', user.id).not('deleted_at', 'is', null)
    await supabase.from('folders').delete().eq('user_id', user.id).not('deleted_at', 'is', null)
    setTrashedNotes([])
    setTrashedFolders([])
  }

  // === SHARE OPERATIONS ===

  const shareNote = async (noteId, mode = 'public', shareKey = null, shareKeyHint = null) => {
    const { hashPassword } = await import('../lib/encryption')

    const updates = {
      is_shared: true,
      share_id: crypto.randomUUID(),
      share_mode: mode,
      share_key_hash: shareKey ? await hashPassword(shareKey) : null,
      share_key_hint: shareKeyHint || null,
    }

    return updateNote(noteId, updates)
  }

  const unshareNote = async (noteId) => {
    return updateNote(noteId, {
      is_shared: false,
      share_id: null,
      share_mode: 'public',
      share_key_hash: null,
      share_key_hint: null,
    })
  }

  const updateShareKey = async (noteId, newKey, hint = null) => {
    const { hashPassword } = await import('../lib/encryption')
    return updateNote(noteId, {
      share_key_hash: newKey ? await hashPassword(newKey) : null,
      share_key_hint: hint,
    })
  }

  // === LOCK OPERATIONS ===

  const lockNote = async (noteId, password) => {
    const { hashPassword } = await import('../lib/encryption')
    const hash = await hashPassword(password)
    return updateNote(noteId, { is_locked: true, password_hash: hash })
  }

  const unlockNote = async (noteId) => {
    return updateNote(noteId, { is_locked: false, password_hash: null })
  }

  const lockFolder = async (folderId, password) => {
    const { hashPassword } = await import('../lib/encryption')
    const hash = await hashPassword(password)
    return updateFolder(folderId, { is_locked: true, password_hash: hash })
  }

  const unlockFolder = async (folderId) => {
    return updateFolder(folderId, { is_locked: false, password_hash: null })
  }

  return (
    <NotesContext.Provider value={{
      folders, notes, activeNote, activeNoteId, loading,
      trashedNotes, trashedFolders,
      isOnline, syncState, pendingCount,
      setActiveNoteId,
      createFolder, updateFolder, deleteFolder,
      createNote, updateNote, deleteNote, moveNote,
      shareNote, unshareNote, updateShareKey,
      lockNote, unlockNote, lockFolder, unlockFolder,
      restoreNote, restoreFolder,
      permanentDeleteNote, permanentDeleteFolder, emptyTrash,
      fetchData, fetchTrash,
    }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) throw new Error('useNotes must be used within NotesProvider')
  return context
}
