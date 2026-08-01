import { useState } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { useDonation } from '../../contexts/DonationContext'
import {
  PanelLeftClose, PanelLeftOpen, Eye, EyeOff, Share2, Lock, Trash2, Heart
} from 'lucide-react'
import ShareDialog from '../sidebar/ShareDialog'
import PasswordDialog from '../sidebar/PasswordDialog'

export default function Header({
  sidebarOpen, toggleSidebar,
  previewOpen, togglePreview,
  editorMode, setEditorMode,
}) {
  const { activeNote, updateNote, deleteNote } = useNotes()
  const { openDonation } = useDonation()
  const [showShare, setShowShare] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleTitleChange = (e) => {
    if (activeNote) {
      updateNote(activeNote.id, { title: e.target.value })
    }
  }

  const handleDelete = async () => {
    if (activeNote) {
      await deleteNote(activeNote.id)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="header">
        <div className="header-left">
          <button className="header-toggle-btn" onClick={toggleSidebar} title={sidebarOpen ? 'Close Panel' : 'Open Panel'}>
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          {activeNote && (
            <input
              className="header-title"
              type="text"
              value={activeNote.title}
              onChange={handleTitleChange}
              placeholder="Note title..."
            />
          )}
        </div>

        {activeNote && (
          <div className="header-right">
            {/* Editor Mode Toggle */}
            <div className="editor-mode-toggle">
              <button
                className={`mode-btn ${editorMode === 'wysiwyg' ? 'active' : ''}`}
                onClick={() => setEditorMode('wysiwyg')}
              >
                Editor
              </button>
              <button
                className={`mode-btn ${editorMode === 'markdown' ? 'active' : ''}`}
                onClick={() => setEditorMode('markdown')}
              >
                Markdown
              </button>
            </div>

            <div className="header-divider" />

            <button className="header-btn" onClick={() => setShowShare(true)} title="Share">
              <Share2 size={16} />
              <span className="btn-label">Share</span>
            </button>

            <button className="header-btn" onClick={() => setShowPassword(true)} title="Lock">
              <Lock size={16} />
              <span className="btn-label">{activeNote.is_locked ? 'Locked' : 'Lock'}</span>
            </button>

            <button
              className={`header-btn ${previewOpen ? 'active' : ''}`}
              onClick={togglePreview}
              title="Preview"
            >
              {previewOpen ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="btn-label">Preview</span>
            </button>

            <button
              className="header-btn"
              onClick={openDonation}
              title="Support PadSync"
              style={{ color: '#ff6b6b' }}
            >
              <Heart size={16} />
            </button>

            <button
              className="header-btn"
              onClick={() => setShowDeleteConfirm(true)}
              title="Move to Trash"
              style={{ color: 'var(--danger)' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      {showShare && activeNote && (
        <ShareDialog note={activeNote} onClose={() => setShowShare(false)} />
      )}

      {/* Password Dialog */}
      {showPassword && activeNote && (
        <PasswordDialog
          type="note"
          item={activeNote}
          onClose={() => setShowPassword(false)}
        />
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>Move to Trash?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              "<strong>{activeNote?.title}</strong>" will be moved to Trash. You can restore it later.
            </p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Move to Trash</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
