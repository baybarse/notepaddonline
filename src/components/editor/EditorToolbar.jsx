import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, List, ListOrdered,
  CheckSquare, Quote, Minus, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
  Table as TableIcon, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2,
  Heading3, Highlighter, Code2, Rows3, Columns3, Trash2
} from 'lucide-react'

export default function EditorToolbar({ editor, onImageUpload, onAddLink }) {
  if (!editor) return null

  const ToolBtn = ({ icon: Icon, title, action, isActive, disabled }) => (
    <button
      className={`toolbar-btn ${isActive ? 'active' : ''}`}
      onMouseDown={(e) => { e.preventDefault(); action?.() }}
      title={title}
      disabled={disabled}
    >
      <Icon size={16} />
    </button>
  )

  return (
    <div className="editor-toolbar">
      {/* Headings */}
      <div className="toolbar-group">
        <ToolBtn icon={Heading1} title="Heading 1" action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} />
        <ToolBtn icon={Heading2} title="Heading 2" action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />
        <ToolBtn icon={Heading3} title="Heading 3" action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} />
      </div>

      <div className="toolbar-divider" />

      {/* Text Formatting */}
      <div className="toolbar-group">
        <ToolBtn icon={Bold} title="Bold" action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
        <ToolBtn icon={Italic} title="Italic" action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
        <ToolBtn icon={UnderlineIcon} title="Underline" action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
        <ToolBtn icon={Strikethrough} title="Strikethrough" action={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />
        <ToolBtn icon={Highlighter} title="Highlight" action={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} />
        <ToolBtn icon={Code} title="Inline Code" action={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} />
      </div>

      <div className="toolbar-divider" />

      {/* Lists */}
      <div className="toolbar-group">
        <ToolBtn icon={List} title="Bullet List" action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
        <ToolBtn icon={ListOrdered} title="Ordered List" action={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
        <ToolBtn icon={CheckSquare} title="Task List" action={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} />
      </div>

      <div className="toolbar-divider" />

      {/* Alignment */}
      <div className="toolbar-group">
        <ToolBtn icon={AlignLeft} title="Align Left" action={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
        <ToolBtn icon={AlignCenter} title="Align Center" action={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
        <ToolBtn icon={AlignRight} title="Align Right" action={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />
      </div>

      <div className="toolbar-divider" />

      {/* Insert */}
      <div className="toolbar-group">
        <ToolBtn icon={LinkIcon} title="Insert Link" action={onAddLink} isActive={editor.isActive('link')} />
        <ToolBtn icon={ImageIcon} title="Insert Image" action={onImageUpload} />
        <ToolBtn icon={TableIcon} title="Insert Table" action={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        <ToolBtn icon={Code2} title="Code Block" action={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} />
        <ToolBtn icon={Quote} title="Blockquote" action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />
        <ToolBtn icon={Minus} title="Horizontal Rule" action={() => editor.chain().focus().setHorizontalRule().run()} />
      </div>

      {/* Table actions (only when inside a table) */}
      {editor.isActive('table') && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-group">
            <ToolBtn icon={Columns3} title="Add Column" action={() => editor.chain().focus().addColumnAfter().run()} />
            <ToolBtn icon={Rows3} title="Add Row" action={() => editor.chain().focus().addRowAfter().run()} />
            <ToolBtn icon={Trash2} title="Delete Table" action={() => editor.chain().focus().deleteTable().run()} />
          </div>
        </>
      )}

      <div className="toolbar-divider" />

      {/* Undo/Redo */}
      <div className="toolbar-group">
        <ToolBtn icon={Undo2} title="Undo" action={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
        <ToolBtn icon={Redo2} title="Redo" action={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
      </div>
    </div>
  )
}
