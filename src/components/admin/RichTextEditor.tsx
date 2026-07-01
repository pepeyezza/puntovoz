"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

/**
 * Editor enriquecido para Posts y Notas del Observatorio.
 * Guarda el contenido como HTML en un <input type="hidden"> con el `name`
 * indicado, para que viaje normal dentro de un <form action={serverAction}>.
 */
export default function RichTextEditor({ name, defaultValue = "", placeholder }: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribí el contenido…" }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL del enlace:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  }

  const ToolbarButton = ({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`rounded-lg p-2 transition-colors ${
        active ? "bg-principal text-secundario" : "text-principal/70 hover:bg-principal/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl border border-principal/15 bg-secundario">
      <div className="flex flex-wrap items-center gap-1 border-b border-principal/10 p-2">
        <ToolbarButton label="Negrita" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Cursiva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Subtítulo" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Subtítulo menor" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Cita" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Enlace" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-principal/10" />
        <ToolbarButton label="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton label="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="prose-voz min-h-[240px] px-4 py-3 text-sm leading-relaxed focus:outline-none [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:outline-none"
      />

      {/* Input oculto que viaja con el form al hacer submit */}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
