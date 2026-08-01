import { useState, useCallback, useEffect, useRef } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import TipTapEditor from './TipTapEditor'
import MarkdownEditorView from './MarkdownEditor'
import PasswordDialog from '../sidebar/PasswordDialog'
import { Lock } from 'lucide-react'
import '../../styles/editor.css'

export default function NoteEditor({ mode }) {
  const { activeNote, updateNote } = useNotes()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const saveTimer = useRef(null)

  useEffect(() => {
    setIsUnlocked(!activeNote?.is_locked)
  }, [activeNote?.id, activeNote?.is_locked])

  const handleContentChange = useCallback((content, html) => {
    if (!activeNote) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      updateNote(activeNote.id, {
        content: content,
        content_html: html,
      })
    }, 1500)
  }, [activeNote, updateNote])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  if (!activeNote) return null

  if (activeNote.is_locked && !isUnlocked) {
    return (
      <div className="empty-state">
        <Lock size={48} style={{ color: 'var(--warning)', opacity: 0.6 }} />
        <h3>Locked Note</h3>
        <p>A password is required to access this note.</p>
        <button className="btn btn-primary" onClick={() => setShowPasswordDialog(true)}>
          Enter Password
        </button>

        {showPasswordDialog && (
          <PasswordDialog
            type="note"
            item={activeNote}
            onClose={() => setShowPasswordDialog(false)}
            onUnlock={() => setIsUnlocked(true)}
          />
        )}
      </div>
    )
  }

  return (
    <>
      {mode === 'wysiwyg' ? (
        <TipTapEditor
          note={activeNote}
          onContentChange={handleContentChange}
        />
      ) : (
        <MarkdownEditorView
          note={activeNote}
          onContentChange={handleContentChange}
        />
      )}
    </>
  )
}
