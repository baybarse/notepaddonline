import { useState, useCallback } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import Sidebar from './Sidebar'
import Header from './Header'
import PreviewPanel from './PreviewPanel'
import NoteEditor from '../editor/NoteEditor'
import SyncIndicator from '../ui/SyncIndicator'
import { FileText, PenLine, Eye, FolderOpen, Share2 } from 'lucide-react'
import ShareDialog from '../sidebar/ShareDialog'
import '../../styles/layout.css'

export default function AppLayout() {
  const { activeNote, isOnline, syncState, pendingCount } = useNotes()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [previewMode, setPreviewMode] = useState('off') // 'off' | 'split' | 'fullscreen'
  const [editorMode, setEditorMode] = useState('wysiwyg')
  const [showMobileShare, setShowMobileShare] = useState(false)

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

        {/* Sync Indicator */}
        <SyncIndicator isOnline={isOnline} syncState={syncState} pendingCount={pendingCount} />
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
          className={`mobile-nav-btn ${!sidebarOpen && !isPreviewOpen && !showMobileShare ? 'active' : ''}`}
          onClick={() => { setSidebarOpen(false); setPreviewMode('off'); setShowMobileShare(false) }}
        >
          <PenLine />
          <span>Editor</span>
        </button>
        <button
          className={`mobile-nav-btn ${showMobileShare ? 'active' : ''}`}
          onClick={() => { if (activeNote) setShowMobileShare(true); setSidebarOpen(false) }}
          disabled={!activeNote}
        >
          <Share2 />
          <span>Share</span>
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

      {/* Mobile Share Dialog */}
      {showMobileShare && activeNote && (
        <ShareDialog note={activeNote} onClose={() => setShowMobileShare(false)} />
      )}
    </div>
  )
}
