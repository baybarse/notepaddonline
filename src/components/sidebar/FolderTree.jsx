import { useState, useMemo } from 'react'
import { useNotes } from '../../contexts/NotesContext'
import { ChevronRight, Folder, FolderOpen, FileText, Plus, MoreHorizontal, Lock, Share2, Pencil, Trash2, FolderPlus, FilePlus, AlertTriangle, GripVertical } from 'lucide-react'
import PasswordDialog from './PasswordDialog'

export default function FolderTree({ search, onNoteClick, activeNoteId, onNoteDragStart, onNoteDragEnd, dragOverTarget, setDragOverTarget }) {
  const { folders, notes, createFolder } = useNotes()

  const rootFolders = useMemo(
    () => folders.filter(f => !f.parent_id),
    [folders]
  )

  return (
    <div>
      <div className="sidebar-section-title">
        <span>Folders</span>
        <button
          className="sidebar-section-btn"
          onClick={() => createFolder('New Folder')}
          title="New Folder"
        >
          <Plus size={14} />
        </button>
      </div>

      {rootFolders.length === 0 && !search && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', padding: '0 var(--space-2)' }}>
          No folders created yet
        </p>
      )}

      {rootFolders.map(folder => (
        <FolderItem
          key={folder.id}
          folder={folder}
          folders={folders}
          notes={notes}
          search={search}
          onNoteClick={onNoteClick}
          activeNoteId={activeNoteId}
          onNoteDragStart={onNoteDragStart}
          onNoteDragEnd={onNoteDragEnd}
          dragOverTarget={dragOverTarget}
          setDragOverTarget={setDragOverTarget}
          depth={0}
        />
      ))}
    </div>
  )
}

function FolderItem({ folder, folders, notes, search, onNoteClick, activeNoteId, onNoteDragStart, onNoteDragEnd, dragOverTarget, setDragOverTarget, depth }) {
  const { createFolder, createNote, deleteFolder, updateFolder, moveNote } = useNotes()
  const [isOpen, setIsOpen] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(folder.name)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(!folder.is_locked)

  const childFolders = useMemo(
    () => folders.filter(f => f.parent_id === folder.id),
    [folders, folder.id]
  )

  const folderNotes = useMemo(() => {
    const filtered = notes.filter(n => n.folder_id === folder.id)
    if (!search?.trim()) return filtered
    const q = search.toLowerCase()
    return filtered.filter(n => n.title.toLowerCase().includes(q))
  }, [notes, folder.id, search])

  const handleRename = async () => {
    if (renameValue.trim() && renameValue !== folder.name) {
      await updateFolder(folder.id, { name: renameValue.trim() })
    }
    setIsRenaming(false)
  }

  const handleDelete = async () => {
    try {
      await deleteFolder(folder.id)
    } catch (err) {
      console.error('Delete folder error:', err)
    }
    setShowDeleteConfirm(false)
  }

  const handleCreateSubfolder = async () => {
    await createFolder('New Folder', folder.id)
    setIsOpen(true)
    setShowMenu(false)
  }

  const handleCreateNote = async () => {
    await createNote(folder.id)
    setIsOpen(true)
    setShowMenu(false)
  }

  const handleFolderClick = () => {
    if (folder.is_locked && !isUnlocked) {
      setShowPasswordDialog(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  // Drag-drop: allow dropping notes into this folder
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverTarget?.(folder.id)
  }

  const handleDragLeave = (e) => {
    e.stopPropagation()
    if (dragOverTarget === folder.id) {
      setDragOverTarget?.(null)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const noteId = e.dataTransfer.getData('noteId')
    if (noteId) {
      try {
        await moveNote(noteId, folder.id)
        setIsOpen(true)
      } catch (err) {
        console.error('Move error:', err)
      }
    }
    setDragOverTarget?.(null)
  }

  const isDragOver = dragOverTarget === folder.id

  return (
    <div style={{ marginLeft: depth > 0 ? '12px' : 0 }}>
      <div
        className={`tree-item folder-item ${isDragOver ? 'drag-over' : ''}`}
        style={{ position: 'relative' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          className={`folder-toggle ${isOpen && isUnlocked ? 'open' : ''}`}
          onClick={handleFolderClick}
        >
          <ChevronRight size={12} />
        </button>

        {isOpen && isUnlocked ? (
          <FolderOpen className="tree-item-icon folder-icon" size={16} />
        ) : (
          <Folder className="tree-item-icon folder-icon" size={16} />
        )}

        {isRenaming ? (
          <input
            className="tree-rename-input"
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsRenaming(false); }}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="tree-item-label" onDoubleClick={() => { setIsRenaming(true); setRenameValue(folder.name) }}>
            {folder.name}
          </span>
        )}

        {folder.is_locked && <Lock className="lock-icon" size={12} />}

        <div className="tree-item-actions">
          <button
            className="tree-action-btn"
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            title="Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>

        {showMenu && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)' }} onClick={() => setShowMenu(false)} />
            <div className="create-menu" style={{ zIndex: 'calc(var(--z-overlay) + 1)' }}>
              <button className="create-menu-item" onClick={handleCreateNote}>
                <FilePlus size={16} /> New Note
              </button>
              <button className="create-menu-item" onClick={handleCreateSubfolder}>
                <FolderPlus size={16} /> Subfolder
              </button>
              <div className="context-menu-separator" />
              <button className="create-menu-item" onClick={() => { setIsRenaming(true); setRenameValue(folder.name); setShowMenu(false) }}>
                <Pencil size={16} /> Rename
              </button>
              <button className="create-menu-item" onClick={() => { setShowPasswordDialog(true); setShowMenu(false) }}>
                <Lock size={16} /> {folder.is_locked ? 'Lock Settings' : 'Lock'}
              </button>
              <div className="context-menu-separator" />
              <button className="create-menu-item" onClick={() => { setShowDeleteConfirm(true); setShowMenu(false) }} style={{ color: 'var(--danger)' }}>
                <Trash2 size={16} /> Move to Trash
              </button>
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="dialog-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} style={{ color: 'var(--warning)' }} /> Move to Trash?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              "<strong>{folder.name}</strong>" and all notes inside it will be moved to Trash. You can restore them later.
            </p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Move to Trash</button>
            </div>
          </div>
        </div>
      )}

      {isOpen && isUnlocked && (
        <div className="tree-children">
          {childFolders.map(child => (
            <FolderItem
              key={child.id}
              folder={child}
              folders={folders}
              notes={notes}
              search={search}
              onNoteClick={onNoteClick}
              activeNoteId={activeNoteId}
              onNoteDragStart={onNoteDragStart}
              onNoteDragEnd={onNoteDragEnd}
              dragOverTarget={dragOverTarget}
              setDragOverTarget={setDragOverTarget}
              depth={depth + 1}
            />
          ))}
          {folderNotes.map(note => (
            <div
              key={note.id}
              className={`tree-item ${activeNoteId === note.id ? 'active' : ''}`}
              onClick={() => onNoteClick(note.id)}
              draggable
              onDragStart={(e) => onNoteDragStart?.(e, note.id)}
              onDragEnd={onNoteDragEnd}
            >
              <GripVertical className="drag-handle" size={12} />
              <FileText className="tree-item-icon" size={16} />
              <span className="tree-item-label">{note.title}</span>
              {note.is_locked && <Lock className="lock-icon" size={12} />}
              {note.is_shared && <Share2 className="share-icon" size={12} />}
            </div>
          ))}
        </div>
      )}

      {showPasswordDialog && (
        <PasswordDialog
          type="folder"
          item={folder}
          onClose={() => setShowPasswordDialog(false)}
          onUnlock={() => setIsUnlocked(true)}
        />
      )}
    </div>
  )
}
