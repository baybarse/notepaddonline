import { useState, useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotes } from '../../contexts/NotesContext'
import { useDonation } from '../../contexts/DonationContext'
import FolderTree from '../sidebar/FolderTree'
import TrashPanel from '../sidebar/TrashPanel'
import MoveToFolderDialog from '../sidebar/MoveToFolderDialog'
import ShareDialog from '../sidebar/ShareDialog'
import { Plus, Search, LogOut, FileText, Image, Heart, Trash2, MoreHorizontal, ArrowRight, Trash, AlertTriangle, GripVertical, Share2 } from 'lucide-react'
import '../../styles/sidebar.css'

export default function Sidebar({ onCloseMobile }) {
  const { user, profile, signOut } = useAuth()
  const { notes, folders, createNote, deleteNote, moveNote, activeNoteId, setActiveNoteId } = useNotes()
  const { openDonation } = useDonation()
  const [search, setSearch] = useState('')
  const [showTrash, setShowTrash] = useState(false)
  const [noteMenu, setNoteMenu] = useState(null)
  const [moveNoteId, setMoveNoteId] = useState(null)
  const [deleteNoteConfirm, setDeleteNoteConfirm] = useState(null)
  const [shareNoteId, setShareNoteId] = useState(null)
  const [dragOverTarget, setDragOverTarget] = useState(null) // 'uncategorized' | folder_id

  const uncategorizedNotes = useMemo(
    () => notes.filter(n => !n.folder_id),
    [notes]
  )

  const filteredUncategorized = useMemo(() => {
    if (!search.trim()) return uncategorizedNotes
    const q = search.toLowerCase()
    return uncategorizedNotes.filter(n => n.title.toLowerCase().includes(q))
  }, [uncategorizedNotes, search])

  const photoCount = profile?.photo_count || 0
  const photoPercent = (photoCount / 10) * 100

  const handleNewNote = async () => {
    try {
      await createNote(null)
    } catch (err) {
      console.error('Create note error:', err)
    }
  }

  const handleNoteClick = (noteId) => {
    setActiveNoteId(noteId)
    // Don't close sidebar on desktop - only on mobile
  }

  const handleDeleteNote = async () => {
    if (!deleteNoteConfirm) return
    try {
      await deleteNote(deleteNoteConfirm.id)
    } catch (err) {
      console.error('Delete note error:', err)
    }
    setDeleteNoteConfirm(null)
  }

  // Drag handlers for notes
  const handleNoteDragStart = (e, noteId) => {
    e.dataTransfer.setData('noteId', noteId)
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.classList.add('dragging')
  }

  const handleNoteDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging')
    setDragOverTarget(null)
  }

  const handleUncategorizedDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverTarget('uncategorized')
  }

  const handleUncategorizedDragLeave = () => {
    setDragOverTarget(null)
  }

  const handleUncategorizedDrop = async (e) => {
    e.preventDefault()
    const noteId = e.dataTransfer.getData('noteId')
    if (noteId) {
      try {
        await moveNote(noteId, null)
      } catch (err) {
        console.error('Move error:', err)
      }
    }
    setDragOverTarget(null)
  }

  const displayName = profile?.display_name || user?.user_metadata?.full_name || 'User'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="sidebar">
      {/* Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} referrerPolicy="no-referrer" />
          ) : (
            <span className="sidebar-avatar-fallback">{initials}</span>
          )}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{displayName}</div>
          <div className="sidebar-user-email">{user?.email}</div>
        </div>
        <button className="sidebar-logout-btn" onClick={signOut} title="Sign Out">
          <LogOut size={16} />
        </button>
      </div>

      {/* New Note Button */}
      <button className="new-note-btn" onClick={handleNewNote}>
        <Plus size={16} />
        New Note
      </button>

      {/* Search */}
      <div className="sidebar-search">
        <div className="sidebar-search-wrapper">
          <Search className="sidebar-search-icon" />
          <input
            className="sidebar-search-input"
            type="text"
            placeholder="Search notes or folders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tree */}
      <div className="sidebar-tree">
        <FolderTree
          search={search}
          onNoteClick={handleNoteClick}
          activeNoteId={activeNoteId}
          onNoteDragStart={handleNoteDragStart}
          onNoteDragEnd={handleNoteDragEnd}
          dragOverTarget={dragOverTarget}
          setDragOverTarget={setDragOverTarget}
        />

        {/* Uncategorized Section */}
        <div
          className={`sidebar-section-title ${dragOverTarget === 'uncategorized' ? 'drag-over' : ''}`}
          style={{ marginTop: 'var(--space-3)' }}
          onDragOver={handleUncategorizedDragOver}
          onDragLeave={handleUncategorizedDragLeave}
          onDrop={handleUncategorizedDrop}
        >
          <span>Uncategorized</span>
        </div>

        <div
          className={`uncategorized-zone ${dragOverTarget === 'uncategorized' ? 'drag-over' : ''}`}
          onDragOver={handleUncategorizedDragOver}
          onDragLeave={handleUncategorizedDragLeave}
          onDrop={handleUncategorizedDrop}
        >
          {filteredUncategorized.length === 0 && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: '0 var(--space-2)' }}>
              {search ? 'No results found' : 'No uncategorized notes'}
            </p>
          )}

          {filteredUncategorized.map(note => (
            <div
              key={note.id}
              className={`tree-item ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => handleNoteClick(note.id)}
              draggable
              onDragStart={(e) => handleNoteDragStart(e, note.id)}
              onDragEnd={handleNoteDragEnd}
              style={{ position: 'relative' }}
            >
              <GripVertical className="drag-handle" size={12} />
              <FileText className="tree-item-icon" size={16} />
              <span className="tree-item-label">{note.title}</span>
              {note.is_locked && <span className="lock-icon">🔒</span>}
              {note.is_shared && <span className="share-icon">🔗</span>}
              <div className="tree-item-actions">
                <button
                  className="tree-action-btn"
                  onClick={(e) => { e.stopPropagation(); setNoteMenu(noteMenu === note.id ? null : note.id) }}
                  title="Options"
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>

              {noteMenu === note.id && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)' }} onClick={() => setNoteMenu(null)} />
                  <div className="create-menu" style={{ zIndex: 'calc(var(--z-overlay) + 1)' }}>
                    <button className="create-menu-item" onClick={() => { setActiveNoteId(note.id); setShareNoteId(note.id); setNoteMenu(null) }}>
                      <Share2 size={16} /> Share
                    </button>
                    <button className="create-menu-item" onClick={() => { setMoveNoteId(note.id); setNoteMenu(null) }}>
                      <ArrowRight size={16} /> Move to Folder
                    </button>
                    <div className="context-menu-separator" />
                    <button className="create-menu-item" onClick={() => { setDeleteNoteConfirm(note); setNoteMenu(null) }} style={{ color: 'var(--danger)' }}>
                      <Trash size={16} /> Move to Trash
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="photo-usage">
          <Image size={14} />
          <div className="photo-usage-bar">
            <div
              className={`photo-usage-fill ${photoPercent > 80 ? 'danger' : photoPercent > 60 ? 'warning' : ''}`}
              style={{ width: `${photoPercent}%` }}
            />
          </div>
          <span>{photoCount}/10</span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          <button onClick={() => setShowTrash(true)} className="sidebar-action-btn" title="Trash">
            <Trash2 size={14} />
          </button>
          <button onClick={openDonation} className="sidebar-action-btn" title="Support PadSync" style={{ color: '#ff6b6b' }}>
            <Heart size={14} />
          </button>
        </div>
      </div>

      {showTrash && <TrashPanel onClose={() => setShowTrash(false)} />}
      {moveNoteId && <MoveToFolderDialog noteId={moveNoteId} onClose={() => setMoveNoteId(null)} />}
      {shareNoteId && (() => {
        const shareNote = notes.find(n => n.id === shareNoteId)
        return shareNote ? <ShareDialog note={shareNote} onClose={() => setShareNoteId(null)} /> : null
      })()}

      {deleteNoteConfirm && (
        <div className="dialog-overlay" onClick={() => setDeleteNoteConfirm(null)}>
          <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} style={{ color: 'var(--warning)' }} /> Move to Trash?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              "<strong>{deleteNoteConfirm.title}</strong>" will be moved to Trash. You can restore it later.
            </p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteNoteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteNote}>Move to Trash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
