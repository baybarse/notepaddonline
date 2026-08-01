import { useState, useCallback } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import Sidebar from './Sidebar'
import Header from './Header'
import PreviewPanel from './PreviewPanel'
import NoteEditor from '../editor/NoteEditor'
import { FileText, PenLine, Eye, FolderOpen } from 'lucide-react'
import '../../styles/layout.css'

export default function AppLayout() {
  const { activeNote } = useNotes()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState('off') // 'off' | 'split' | 'fullscreen'
  const [editorMode, setEditorMode] = useState('wysiwyg')

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), [])

  const togglePreview = useCallback(() => {
    setPreviewMode(prev => prev === 'off' ? 'split' : 'off')
  }, [])

  const setPreviewFullscreen = useCallback(() => {
    setPreviewMode('fullscreen')
  }, [])

  const exitFullscreen = useCallback(() => {
    setPreviewMode('split')
  }, [])

  const closePreview = useCallback(() => {
    setPreviewMode('off')
  }, [])

  const isPreviewOpen = previewMode !== 'off'
  const isFullscreen = previewMode === 'fullscreen'

  const layoutClasses = [
    'app-layout',
    !sidebarOpen && 'sidebar-collapsed',
    previewMode === 'split' && activeNote && 'preview-split',
    previewMode === 'fullscreen' && activeNote && 'preview-fullscreen',
  ].filter(Boolean).join(' ')

  return (
    <div className={layoutClasses}>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      <div className="main-content">
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          previewOpen={isPreviewOpen}
          togglePreview={togglePreview}
          editorMode={editorMode}
          setEditorMode={setEditorMode}
        />

        <div className="editor-container">
          {activeNote ? (
            <NoteEditor mode={editorMode} />
          ) : (
            <div className="empty-state">
              <FileText className="empty-state-icon" />
              <h3>No Note Selected</h3>
              <p>Select a note from the sidebar or create a new one.</p>
            </div>
          )}
        </div>
      </div>

      {isPreviewOpen && activeNote && (
        <PreviewPanel
          onClose={closePreview}
          isFullscreen={isFullscreen}
          onToggleFullscreen={isFullscreen ? exitFullscreen : setPreviewFullscreen}
        />
      )}

      <nav className="mobile-nav">
        <button
          className={`mobile-nav-btn ${sidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          <FolderOpen />
          <span>Notes</span>
        </button>
        <button
          className={`mobile-nav-btn ${!sidebarOpen && !isPreviewOpen ? 'active' : ''}`}
          onClick={() => { setSidebarOpen(false); setPreviewMode('off') }}
        >
          <PenLine />
          <span>Editor</span>
        </button>
        <button
          className={`mobile-nav-btn ${isPreviewOpen ? 'active' : ''}`}
          onClick={() => { setPreviewMode(isPreviewOpen ? 'off' : 'split'); setSidebarOpen(false) }}
          disabled={!activeNote}
        >
          <Eye />
          <span>Preview</span>
        </button>
      </nav>
    </div>
  )
}
