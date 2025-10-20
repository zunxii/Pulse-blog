import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  Quote,
  Heading2,
} from 'lucide-react'

interface EditorToolbarProps {
  onInsert: (before: string, after?: string) => void
}

export function EditorToolbar({ onInsert }: EditorToolbarProps) {
  const toolbarButtons = [
    { icon: Bold, action: () => onInsert('**'), label: 'Bold', shortcut: 'Ctrl+B' },
    { icon: Italic, action: () => onInsert('*'), label: 'Italic', shortcut: 'Ctrl+I' },
    { icon: Heading2, action: () => onInsert('## ', '\n'), label: 'Heading' },
    { icon: Quote, action: () => onInsert('> ', '\n'), label: 'Quote' },
    { icon: Code, action: () => onInsert('`'), label: 'Inline Code' },
    { icon: Link2, action: () => onInsert('[', '](url)'), label: 'Link' },
    { icon: List, action: () => onInsert('- ', '\n'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => onInsert('1. ', '\n'), label: 'Numbered List' },
  ]

  return (
    <div className="flex items-center gap-1 p-2 bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
      {toolbarButtons.map((button, idx) => (
        <button
          key={idx}
          onClick={button.action}
          title={`${button.label} ${button.shortcut ? `(${button.shortcut})` : ''}`}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white flex-shrink-0"
        >
          <button.icon className="w-4 h-4" />
        </button>
      ))}
      
      <div className="ml-auto pl-4 border-l border-white/10 flex items-center gap-2">
        <button
          onClick={() => onInsert('```\n', '\n```')}
          className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          Code Block
        </button>
      </div>
    </div>
  )
}