import { useState } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { Folder, X, ArrowRight } from 'lucide-react'

export default function MoveToFolderDialog({ noteId, onClose }) {
  const { folders, moveNote } = useNotes()
  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const handleMove = async () => {
    try {
      await moveNote(noteId, selectedFolderId)
      onClose()
    } catch (err) {
      console.error('Move error:', err)
    }
  }

  const handleMoveToUncategorized = async () => {
    try {
      await moveNote(noteId, null)
      onClose()
    } catch (err) {
      console.error('Move error:', err)
    }
  }

  const renderFolders = (parentId = null, depth = 0) => {
    return folders
      .filter(f => f.parent_id === parentId)
      .map(folder => (
        <div key={folder.id}>
          <button
            className={`move-folder-item ${selectedFolderId === folder.id ? 'selected' : ''}`}
            onClick={() => setSelectedFolderId(folder.id)}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
          >
            <Folder size={16} />
            <span>{folder.name}</span>
          </button>
          {renderFolders(folder.id, depth + 1)}
        </div>
      ))
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRight size={18} /> Move to Folder
          </h3>
          <button className="header-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '0 calc(-1 * var(--space-4))', padding: '0 var(--space-2)' }}>
          <button
            className={`move-folder-item ${selectedFolderId === null ? 'selected' : ''}`}
            onClick={() => setSelectedFolderId(null)}
          >
            <Folder size={16} />
            <span>Uncategorized</span>
          </button>
          {renderFolders()}
        </div>

        {folders.length === 0 && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
            No folders. Create a folder first.
          </p>
        )}

        <div className="dialog-actions" style={{ marginTop: 'var(--space-4)' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleMove}>Move</button>
        </div>
      </div>
    </div>
  )
}
