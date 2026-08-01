import { useRef, useCallback } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { X, Download, Printer, Maximize2, Minimize2 } from 'lucide-react'
import '../../styles/preview.css'

export default function PreviewPanel({ onClose, isFullscreen, onToggleFullscreen }) {
  const { activeNote } = useNotes()
  const printRef = useRef()

  const handlePrint = useCallback(() => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeNote?.title || 'PadSync Note'}</title>
          ${styles}
          <style>
            body { 
              background: white !important; 
              color: #1a1a2e !important; 
              padding: 40px !important;
              font-family: 'Inter', system-ui, sans-serif;
            }
            .preview-content h1 { color: #1a1a2e !important; }
            .preview-content code { background: #f3f4f6 !important; }
            .preview-content pre { background: #f8f9fa !important; }
          </style>
        </head>
        <body>
          <div class="preview-content">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }, [activeNote])

  if (!activeNote) return null

  return (
    <div className={`preview-panel ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="preview-header">
        <h3>PREVIEW</h3>
        <div className="preview-actions">
          <button className="header-btn" onClick={onToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="header-btn" onClick={handlePrint} title="Save as PDF / Print">
            <Download size={16} />
          </button>
          <button className="header-btn" onClick={handlePrint} title="Print">
            <Printer size={16} />
          </button>
          <button className="header-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="preview-body">
        <div className="preview-content" ref={printRef}>
          <h1>{activeNote.title}</h1>
          {activeNote.content_html ? (
            <div dangerouslySetInnerHTML={{ __html: activeNote.content_html }} />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              This note has no content yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
