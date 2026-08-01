import { useEffect, useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import EditorToolbar from './EditorToolbar'
import ImageUpload from './ImageUpload'

const lowlight = createLowlight(common)

export default function TipTapEditor({ note, onContentChange }) {
  const [showImageUpload, setShowImageUpload] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'note-image' },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: note?.content || '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const html = editor.getHTML()
      onContentChange(json, html)
    },
  })

  // Update content when note changes
  useEffect(() => {
    if (editor && note) {
      const currentContent = JSON.stringify(editor.getJSON())
      const newContent = JSON.stringify(note.content)
      if (currentContent !== newContent && note.content) {
        editor.commands.setContent(note.content, false)
      }
    }
  }, [note?.id]) // Only when note ID changes

  const handleImageInsert = useCallback((url) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
    setShowImageUpload(false)
  }, [editor])

  const handleAddLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Link URL:', previousUrl || 'https://')
    
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <>
      <EditorToolbar
        editor={editor}
        onImageUpload={() => setShowImageUpload(true)}
        onAddLink={handleAddLink}
      />
      <div className="tiptap-wrapper">
        <EditorContent editor={editor} />
      </div>

      {showImageUpload && (
        <ImageUpload
          onInsert={handleImageInsert}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </>
  )
}
