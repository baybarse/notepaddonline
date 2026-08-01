import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { verifyPassword } from '../../lib/encryption'
import { FileText, Lock, AlertCircle, Lightbulb } from 'lucide-react'
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
      setKeyError('Anahtar girin.')
      return
    }

    try {
      const isValid = await verifyPassword(keyInput, note.share_key_hash)
      if (isValid) {
        setUnlocked(true)
        setNeedsKey(false)
        setKeyError('')
      } else {
        setKeyError('Yanlış anahtar. Tekrar deneyin.')
      }
    } catch {
      setKeyError('Doğrulama sırasında bir hata oluştu.')
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="shared-page">
        <SharedHeader />
        <div className="loading-screen" style={{ flex: 1 }}>
          <div className="spinner lg" />
          <p>Not yükleniyor...</p>
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
          <h2>Not Bulunamadı</h2>
          <p>Bu paylaşım linki geçersiz veya not sahibi paylaşımı kaldırmış olabilir.</p>
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
            <h2>Korumalı Not</h2>
            <p>Bu nota erişmek için paylaşım anahtarı gerekiyor.</p>

            {note.share_key_hint && (
              <div className="shared-key-hint">
                <Lightbulb size={12} />
                İpucu: {note.share_key_hint}
              </div>
            )}

            <input
              className="shared-key-input"
              type="password"
              placeholder="Anahtarı girin"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setKeyError('') }}
              autoFocus
            />

            {keyError && <p className="shared-key-error">{keyError}</p>}

            <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
              Erişim Sağla
            </button>
          </form>
        </div>
        <SharedFooter />
      </div>
    )
  }

  // Show Note
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="shared-page">
      <SharedHeader />
      <div className="shared-content">
        <h1 className="shared-title">{note.title}</h1>
        <div className="shared-meta">
          <span>Oluşturulma: {formatDate(note.created_at)}</span>
          <span>Güncelleme: {formatDate(note.updated_at)}</span>
        </div>
        <div
          className="shared-body preview-content"
          dangerouslySetInnerHTML={{ __html: note.content_html || '<p>Bu not henüz içerik barındırmıyor.</p>' }}
        />
      </div>
      <SharedFooter />
    </div>
  )
}

function SharedHeader() {
  return (
    <div className="shared-header">
      <a href={import.meta.env.VITE_BASE_URL || '/'} className="shared-logo">
        <div className="shared-logo-icon">
          <FileText size={18} />
        </div>
        <span>PadSync</span>
      </a>
    </div>
  )
}

function SharedFooter() {
  return (
    <div className="shared-footer">
      <a href={import.meta.env.VITE_BASE_URL || '/'}>PadSync</a> ile oluşturuldu — Akıllı Not Defteri
    </div>
  )
}
