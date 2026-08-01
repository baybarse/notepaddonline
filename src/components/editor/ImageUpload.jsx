import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Upload, X, Image as ImageIcon, Link2 } from 'lucide-react'

export default function ImageUpload({ onInsert, onClose }) {
  const { user, profile } = useAuth()
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef()

  const photoCount = profile?.photo_count || 0
  const MAX_PHOTOS = 10
  const MAX_SIZE = 4 * 1024 * 1024 // 4MB

  const handleFile = async (file) => {
    setError('')

    // Check photo limit
    if (photoCount >= MAX_PHOTOS) {
      setError(`You've reached the photo limit (${MAX_PHOTOS}/${MAX_PHOTOS}). Cannot upload more.`)
      return
    }

    // Check file size
    if (file.size > MAX_SIZE) {
      setError('File size cannot exceed 4MB.')
      return
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      setError('Supported formats: JPEG, PNG, GIF, WebP, SVG')
      return
    }

    setUploading(true)
    setProgress(30)

    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${ext}`

      setProgress(50)

      const { data, error: uploadError } = await supabase.storage
        .from('note-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      setProgress(80)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('note-images')
        .getPublicUrl(fileName)

      // Update photo count
      await supabase
        .from('profiles')
        .update({ photo_count: photoCount + 1 })
        .eq('id', user.id)

      setProgress(100)

      // Insert image into editor
      onInsert(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('An error occurred while uploading: ' + (err.message || ''))
    }

    setUploading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) handleFile(file)
          break
        }
      }
    }
  }

  const handleUrlInsert = () => {
    if (urlInput.trim()) {
      onInsert(urlInput.trim())
    }
  }

  return (
    <div className="image-upload-overlay" onClick={onClose} onPaste={handlePaste}>
      <div className="image-upload-dialog" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ImageIcon size={20} /> Insert Image
          </h3>
          <button className="header-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Photo limit info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)',
          background: photoCount >= 8 ? 'var(--warning-bg)' : 'var(--glass-bg)',
          borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)',
          color: photoCount >= 8 ? 'var(--warning)' : 'var(--text-muted)'
        }}>
          <ImageIcon size={14} />
          Used: {photoCount}/{MAX_PHOTOS} photos (max 4MB each)
        </div>

        {/* Dropzone */}
        <div
          className={`image-dropzone ${dragOver ? 'dragging' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload size={32} />
          <p>
            <span className="accent">Choose a file</span> or drag & drop
          </p>
          <p style={{ fontSize: 'var(--text-xs)' }}>Or paste with Ctrl+V</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }}
        />

        {/* Progress */}
        {uploading && (
          <div className="image-upload-progress">
            <div className="image-upload-progress-bar">
              <div className="image-upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
              Uploading... {progress}%
            </p>
          </div>
        )}

        {/* URL Input */}
        <div style={{ marginTop: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link2 size={12} /> Or insert via URL:
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              className="image-url-input"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlInsert()}
              style={{ margin: 0, flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleUrlInsert} disabled={!urlInput.trim()}>
              Insert
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--danger)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
