import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {TextStyle} from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Link from '@tiptap/extension-link'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered,
  Link as LinkIcon, Eye, Code,
  Heading2, Heading3,
  Undo, Redo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Variable hint ────────────────────────────────────────────────────────────
const VARIABLES = ['{nombre}', '{email}', '{empresa}', '{ciudad}']

const FONTS = [
  { label: 'Por defecto', value: '' },
  { label: 'Arial',     value: 'Arial, sans-serif' },
  { label: 'Georgia',   value: 'Georgia, serif' },
  { label: 'Verdana',   value: 'Verdana, sans-serif' },
  { label: 'Courier',   value: 'Courier New, monospace' },
]

const COLORS = [
  '#000000', '#374151', '#6B7280',
  '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#3B82F6', '#8B5CF6',
  '#EC4899', '#ffffff',
]

interface Props {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: number
  error?: string
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-7 w-7 flex items-center justify-center rounded text-sm transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-border mx-0.5 shrink-0" />
}

// ─── Main component ───────────────────────────────────────────────────────────
export function RichEditor({ value = '', onChange, placeholder, minHeight = 240, error }: Props) {
  const [preview, setPreview]   = useState(false)
  const [linkUrl, setLinkUrl]   = useState('')
  const [showLink, setShowLink] = useState(false)
  const [color, setColor]       = useState('#000000')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'outline-none prose prose-sm max-w-none px-3 py-2',
        style: `min-height:${minHeight}px`,
      },
    },
  })

  // Sync external value changes (e.g. when template is applied)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      editor.commands.setContent(value ?? '', { emitUpdate: false })
    }
  }, [value, editor])

  if (!editor) return null

  function insertVariable(v: string) {
    editor.chain().focus().insertContent(v).run()
  }

  function applyLink() {
    if (!linkUrl) return
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLink(false)
  }

  function applyColor(hex: string) {
    setColor(hex)
    editor.chain().focus().setColor(hex).run()
  }

  const html = editor.getHTML()

  return (
    <div className={cn('rounded-md border bg-background', error && 'border-destructive')}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-muted/40">

        {/* Undo/Redo */}
        <ToolBtn title="Deshacer" onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}>
          <Undo size={13} />
        </ToolBtn>
        <ToolBtn title="Rehacer" onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}>
          <Redo size={13} />
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn title="Título 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={13} />
        </ToolBtn>
        <ToolBtn title="Título 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={13} />
        </ToolBtn>

        <Divider />

        {/* Bold / Italic / Underline / Strike */}
        <ToolBtn title="Negrita" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={13} />
        </ToolBtn>
        <ToolBtn title="Cursiva" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={13} />
        </ToolBtn>
        <ToolBtn title="Subrayado" active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </ToolBtn>
        <ToolBtn title="Tachado" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={13} />
        </ToolBtn>
        <ToolBtn title="Código inline" active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={13} />
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn title="Alinear izquierda" active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft size={13} />
        </ToolBtn>
        <ToolBtn title="Centrar" active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter size={13} />
        </ToolBtn>
        <ToolBtn title="Alinear derecha" active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight size={13} />
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn title="Lista con viñetas" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={13} />
        </ToolBtn>
        <ToolBtn title="Lista numerada" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={13} />
        </ToolBtn>

        <Divider />

        {/* Color picker */}
        <label title="Color de texto" className="relative cursor-pointer">
          <div className="h-7 w-7 flex flex-col items-center justify-center rounded hover:bg-accent transition-colors">
            <span className="font-bold text-xs leading-none" style={{ color }}>A</span>
            <div className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: color }} />
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => applyColor(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>

        {/* Color swatches */}
        <div className="flex items-center gap-0.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => applyColor(c)}
              className="w-4 h-4 rounded-sm border border-border/50 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <Divider />

        {/* Font family */}
        <select
          title="Fuente"
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run()
            } else {
              editor.chain().focus().unsetFontFamily().run()
            }
          }}
          className="h-7 text-xs bg-transparent border border-border rounded px-1 text-muted-foreground hover:border-foreground focus:outline-none"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <Divider />

        {/* Link */}
        <ToolBtn title="Insertar enlace" active={editor.isActive('link')}
          onClick={() => setShowLink((v) => !v)}>
          <LinkIcon size={13} />
        </ToolBtn>

        <Divider />

        {/* Preview toggle */}
        <ToolBtn title={preview ? 'Editar' : 'Vista previa HTML'} active={preview}
          onClick={() => setPreview((v) => !v)}>
          <Eye size={13} />
        </ToolBtn>
      </div>

      {/* ── Link input ──────────────────────────────────────────────────── */}
      {showLink && (
        <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/20">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://ejemplo.com"
            className="flex-1 text-sm bg-transparent outline-none"
            onKeyDown={(e) => e.key === 'Enter' && applyLink()}
            autoFocus
          />
          <Button type="button" size="sm" variant="outline" className="h-6 text-xs" onClick={applyLink}>
            Aplicar
          </Button>
          <Button type="button" size="sm" variant="ghost" className="h-6 text-xs"
            onClick={() => { editor.chain().focus().unsetLink().run(); setShowLink(false) }}>
            Quitar enlace
          </Button>
        </div>
      )}

      {/* ── Variable hints ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b bg-muted/20">
        <span className="text-xs text-muted-foreground shrink-0">Variables:</span>
        {VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => insertVariable(v)}
            className="text-xs px-1.5 py-0.5 rounded bg-muted hover:bg-accent font-mono transition-colors"
          >
            {v}
          </button>
        ))}
      </div>

      {/* ── Editor / Preview ────────────────────────────────────────────── */}
      {preview ? (
        <div className="relative">
          <div className="absolute top-2 right-3 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            Vista previa
          </div>
          <iframe
            srcDoc={`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; font-size:14px; line-height:1.6;
         color:#1a1a1a; padding:20px 24px; margin:0; max-width:600px; }
  h1,h2,h3 { line-height:1.3; }
  a { color:#3B82F6; }
  ul,ol { padding-left:20px; }
  code { background:#f3f4f6; padding:2px 4px; border-radius:3px; font-size:13px; }
  blockquote { border-left:3px solid #d1d5db; margin:0; padding-left:12px; color:#6b7280; }
  p { margin:0 0 1em; }
</style></head><body>${html}</body></html>`}
            className="w-full border-0 rounded-b-md"
            style={{ minHeight: minHeight, height: 'auto' }}
            onLoad={(e) => {
              const iframe = e.currentTarget
              iframe.style.height = iframe.contentDocument?.body.scrollHeight + 'px'
            }}
            title="Vista previa del correo"
            sandbox="allow-same-origin"
          />
        </div>
      ) : (
        <div className="relative">
          {!editor.getText() && placeholder && (
            <p className="absolute top-2 left-3 text-sm text-muted-foreground pointer-events-none select-none">
              {placeholder}
            </p>
          )}
          <EditorContent editor={editor} />
        </div>
      )}

      {error && <p className="text-xs text-destructive px-3 pb-2">{error}</p>}
    </div>
  )
}
