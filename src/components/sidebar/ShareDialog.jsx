import { useState, useEffect } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { Link2, Copy, Check, Globe, KeyRound, X, RefreshCw } from 'lucide-react'

export default function ShareDialog({ note, onClose }) {
  const { shareNote, unshareNote, updateShareKey, updateNote } = useNotes()
  const [shareMode, setShareMode] = useState(note.share_mode || 'public')
  const [shareKey, setShareKey] = useState('')
  const [shareKeyHint, setShareKeyHint] = useState(note.share_key_hint || '')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const isShared = note.is_shared
  const shareUrl = note.share_id
    ? `${window.location.origin}${import.meta.env.VITE_BASE_URL || '/'}shared/${note.share_id}`
    : null

  const handleShare = async () => {
    setLoading(true)
    try {
      await shareNote(
        note.id,
        shareMode,
        shareMode === 'key' ? shareKey : null,
        shareMode === 'key' ? shareKeyHint : null
      )
    } catch (err) {
      console.error('Share error:', err)
    }
    setLoading(false)
  }

  const handleUnshare = async () => {
    setLoading(true)
    await unshareNote(note.id)
    setLoading(false)
  }

  const handleUpdateKey = async () => {
    if (!shareKey) return
    setLoading(true)
    await updateShareKey(note.id, shareKey, shareKeyHint)
    setShareKey('')
    setLoading(false)
  }

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Link2 size={20} /> Share Settings
          </h3>
          <button className="header-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {!isShared ? (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Share this note to make it accessible via link.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <button
                className={`btn ${shareMode === 'public' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShareMode('public')}
                style={{ flex: 1 }}
              >
                <Globe size={16} /> Public
              </button>
              <button
                className={`btn ${shareMode === 'key' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShareMode('key')}
                style={{ flex: 1 }}
              >
                <KeyRound size={16} /> Key Protected
              </button>
            </div>

            {shareMode === 'key' && (
              <>
                <input
                  className="dialog-input"
                  type="text"
                  placeholder="Set a share key"
                  value={shareKey}
                  onChange={e => setShareKey(e.target.value)}
                />
                <input
                  className="dialog-input"
                  type="text"
                  placeholder="Key hint (optional)"
                  value={shareKeyHint}
                  onChange={e => setShareKeyHint(e.target.value)}
                />
              </>
            )}

            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleShare}
                disabled={loading || (shareMode === 'key' && !shareKey)}
              >
                {loading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-3)',
              background: 'var(--success-bg)', borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--success)'
            }}>
              <Globe size={16} />
              {note.share_mode === 'public' ? 'This note is shared publicly.' : 'This note is shared with key protection.'}
            </div>

            {shareUrl && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)'
              }}>
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  style={{
                    flex: 1, background: 'none', border: 'none', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', outline: 'none'
                  }}
                />
                <button className="btn btn-secondary" onClick={handleCopy} style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-xs)' }}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}

            {note.share_mode === 'key' && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Change Key:
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    className="dialog-input"
                    type="text"
                    placeholder="New key"
                    value={shareKey}
                    onChange={e => setShareKey(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleUpdateKey}
                    disabled={!shareKey || loading}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <input
                  className="dialog-input"
                  type="text"
                  placeholder="Key hint (optional)"
                  value={shareKeyHint}
                  onChange={e => setShareKeyHint(e.target.value)}
                  style={{ marginTop: 'var(--space-2)' }}
                />
              </div>
            )}

            <div className="dialog-actions">
              <button className="btn btn-danger" onClick={handleUnshare} disabled={loading} style={{ marginRight: 'auto' }}>
                Stop Sharing
              </button>
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
