import { useEffect, useState } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { Trash2, RotateCcw, X, AlertTriangle, FileText, Folder, Trash } from 'lucide-react'

export default function TrashPanel({ onClose }) {
  const {
    trashedNotes, trashedFolders, fetchTrash,
    restoreNote, restoreFolder,
    permanentDeleteNote, permanentDeleteFolder, emptyTrash,
  } = useNotes()

  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null) // { type, id, name }

  useEffect(() => {
    fetchTrash()
  }, [fetchTrash])

  const totalItems = trashedNotes.length + trashedFolders.length

  const handlePermanentDelete = async () => {
    if (!showDeleteConfirm) return
    const { type, id } = showDeleteConfirm
    if (type === 'note') await permanentDeleteNote(id)
    else await permanentDeleteFolder(id)
    setShowDeleteConfirm(null)
  }

  const handleEmptyTrash = async () => {
    await emptyTrash()
    setShowEmptyConfirm(false)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now - d
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Trash2 size={20} /> Trash
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {totalItems > 0 && (
              <button className="btn btn-danger" onClick={() => setShowEmptyConfirm(true)} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-1) var(--space-3)' }}>
                <Trash size={14} /> Empty Trash
              </button>
            )}
            <button className="header-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {totalItems === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
              <Trash2 size={40} style={{ opacity: 0.3, marginBottom: 'var(--space-3)' }} />
              <p>Trash is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {trashedFolders.map(f => (
                <div key={f.id} className="trash-item">
                  <Folder size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                  <div className="trash-item-info">
                    <span className="trash-item-name">{f.name}</span>
                    <span className="trash-item-date">{formatDate(f.deleted_at)}</span>
                  </div>
                  <div className="trash-item-actions">
                    <button className="header-btn" onClick={() => restoreFolder(f.id)} title="Restore">
                      <RotateCcw size={14} />
                    </button>
                    <button className="header-btn" onClick={() => setShowDeleteConfirm({ type: 'folder', id: f.id, name: f.name })} title="Delete Permanently" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {trashedNotes.map(n => (
                <div key={n.id} className="trash-item">
                  <FileText size={16} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                  <div className="trash-item-info">
                    <span className="trash-item-name">{n.title}</span>
                    <span className="trash-item-date">{formatDate(n.deleted_at)}</span>
                  </div>
                  <div className="trash-item-actions">
                    <button className="header-btn" onClick={() => restoreNote(n.id)} title="Restore">
                      <RotateCcw size={14} />
                    </button>
                    <button className="header-btn" onClick={() => setShowDeleteConfirm({ type: 'note', id: n.id, name: n.title })} title="Delete Permanently" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Permanent Delete Confirm */}
        {showDeleteConfirm && (
          <div className="dialog-overlay" onClick={() => setShowDeleteConfirm(null)} style={{ zIndex: 10000 }}>
            <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} style={{ color: 'var(--danger)' }} /> Delete Permanently?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                "<strong>{showDeleteConfirm.name}</strong>" will be permanently deleted. This action cannot be undone.
              </p>
              <div className="dialog-actions">
                <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handlePermanentDelete}>Delete Forever</button>
              </div>
            </div>
          </div>
        )}

        {/* Empty Trash Confirm */}
        {showEmptyConfirm && (
          <div className="dialog-overlay" onClick={() => setShowEmptyConfirm(false)} style={{ zIndex: 10000 }}>
            <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} style={{ color: 'var(--danger)' }} /> Empty Trash?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                All {totalItems} item(s) will be permanently deleted. This action cannot be undone.
              </p>
              <div className="dialog-actions">
                <button className="btn btn-secondary" onClick={() => setShowEmptyConfirm(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleEmptyTrash}>Empty Trash</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
