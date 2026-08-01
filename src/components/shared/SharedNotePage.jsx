import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { verifyPassword } from '../../lib/encryption'
import { FileText, Lock, AlertCircle, Lightbulb, Printer, Download } from 'lucide-react'
import '../../styles/shared.css'

export default function SharedNotePage() {
  const { shareId } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [needsKey, setNeedsKey] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [keyError, setKeyError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const contentRef = useRef()

  useEffect(() => {
    fetchNote()
  }, [shareId])

  const fetchNote = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('title, content_html, share_mode, share_key_hash, share_key_hint, created_at, updated_at')
        .eq('share_id', shareId)
        .eq('is_shared', true)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setNote(data)
        if (data.share_mode === 'key') {
          setNeedsKey(true)
        }
      }
    } catch {
      setNotFound(true)
    }
    setLoading(false)
  }

  const handleKeySubmit = async (e) => {
    e?.preventDefault()
    if (!keyInput.trim()) {
      setKeyError('Please enter the access key.')
      return
    }

    try {
      const isValid = await verifyPassword(keyInput, note.share_key_hash)
      if (isValid) {
        setUnlocked(true)
        setNeedsKey(false)
        setKeyError('')
      } else {
        setKeyError('Incorrect key. Please try again.')
      }
    } catch {
      setKeyError('An error occurred during verification.')
    }
  }

  const handlePrint = useCallback(() => {
    const content = contentRef.current
    if (!content || !note) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title} — PadSync</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
              padding: 48px;
              color: #1a1a2e;
              line-height: 1.7;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
            .meta { font-size: 12px; color: #666; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eee; }
            h2 { font-size: 22px; margin: 24px 0 12px; }
            h3 { font-size: 18px; margin: 20px 0 10px; }
            p { margin: 8px 0; }
            code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
            pre { background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 12px 0; overflow-x: auto; }
            pre code { background: none; padding: 0; }
            blockquote { border-left: 3px solid #7c6aff; padding-left: 16px; margin: 12px 0; color: #555; }
            table { border-collapse: collapse; width: 100%; margin: 12px 0; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background: #f3f4f6; font-weight: 600; }
            img { max-width: 100%; border-radius: 8px; }
            ul, ol { padding-left: 24px; margin: 8px 0; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
            @media print {
              body { padding: 24px; }
              .footer { position: fixed; bottom: 0; width: 100%; }
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="meta">Created: ${new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Updated: ${new Date(note.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          ${content.innerHTML}
          <div class="footer">Exported from PadSync — padsync.easywaytools.online</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 600)
  }, [note])

  // Loading
  if (loading) {
    return (
      <div className="shared-page">
        <SharedHeader />
        <div className="loading-screen" style={{ flex: 1 }}>
          <div className="spinner lg" />
          <p>Loading note...</p>
        </div>
      </div>
    )
  }

  // Not Found
  if (notFound) {
    return (
      <div className="shared-page">
        <SharedHeader />
        <div className="shared-not-found">
          <AlertCircle size={64} />
          <h2>Note Not Found</h2>
          <p>This share link is invalid or the note owner may have removed the share.</p>
        </div>
        <SharedFooter />
      </div>
    )
  }

  // Key Required
  if (needsKey && !unlocked) {
    return (
      <div className="shared-page">
        <SharedHeader />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="shared-key-form" onSubmit={handleKeySubmit}>
            <Lock className="lock-icon-large" />
            <h2>Protected Note</h2>
            <p>An access key is required to view this note.</p>

            {note.share_key_hint && (
              <div className="shared-key-hint">
                <Lightbulb size={12} />
                Hint: {note.share_key_hint}
              </div>
            )}

            <input
              className="shared-key-input"
              type="password"
              placeholder="Enter access key"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setKeyError('') }}
              autoFocus
            />

            {keyError && <p className="shared-key-error">{keyError}</p>}

            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              Access Note
            </button>
          </form>
        </div>
        <SharedFooter />
      </div>
    )
  }

  // Show Note
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="shared-page">
      <SharedHeader onPrint={handlePrint} showActions />
      <div className="shared-content">
        <h1 className="shared-title">{note.title}</h1>
        <div className="shared-meta">
          <span>Created: {formatDate(note.created_at)}</span>
          <span>Updated: {formatDate(note.updated_at)}</span>
        </div>
        <div
          className="shared-body preview-content"
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: note.content_html || '<p>This note has no content yet.</p>' }}
        />
      </div>
      <SharedFooter />
    </div>
  )
}

function SharedHeader({ onPrint, showActions }) {
  return (
    <div className="shared-header">
      <a href={import.meta.env.VITE_BASE_URL || '/'} className="shared-logo">
        <div className="shared-logo-icon">
          <FileText size={18} />
        </div>
        <span>PadSync</span>
      </a>
      {showActions && (
        <div className="shared-header-actions">
          <button className="shared-action-btn" onClick={onPrint} title="Print / Save as PDF">
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button className="shared-action-btn" onClick={onPrint} title="Save as PDF">
            <Download size={16} />
            <span>Save PDF</span>
          </button>
        </div>
      )}
    </div>
  )
}

function SharedFooter() {
  return (
    <div className="shared-footer">
      Built with <a href={import.meta.env.VITE_BASE_URL || '/'}>PadSync</a> — Smart Note-Taking App
    </div>
  )
}
