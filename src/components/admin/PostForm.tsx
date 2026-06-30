"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";

type PostFormProps = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    subtitle?: string;
    content?: string;
    category?: string;
    tags?: string;
    status?: string;
    featured?: boolean;
    coverImage?: string;
  };
  /** Si es false, oculta el campo de categoría/slug inicial (para edición, donde el slug ya quedó fijo) */
  esNuevo?: boolean;
  /** Campos ocultos adicionales a enviar con el form, ej. { type: "COLABORADOR", authorId: "..." } */
  hiddenFields?: Record<string, string>;
  /** A dónde vuelve el botón Cancelar */
  cancelHref?: string;
};

export default function PostForm({
  action,
  defaultValues = {},
  esNuevo = true,
  hiddenFields = { type: "EDITORIAL" },
  cancelHref = "/admin/editoriales",
}: PostFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      {Object.entries(hiddenFields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
        />
      </div>

      <div>
        <label htmlFor="subtitle" className="text-sm font-medium">
          Subtítulo
        </label>
        <input
          id="subtitle"
          name="subtitle"
          type="text"
          defaultValue={defaultValues.subtitle}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
        />
      </div>

      {esNuevo && (
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Categoría
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="Ej: Educación"
            defaultValue={defaultValues.category}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>
      )}

      {esNuevo && (
        <div>
          <label htmlFor="tags" className="text-sm font-medium">
            Etiquetas (separadas por coma)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="presupuesto, gestión pública"
            defaultValue={defaultValues.tags}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>
      )}

      <ImageUploadField name="coverImage" defaultValue={defaultValues.coverImage} label="Imagen de portada" />

      <div>
        <label className="text-sm font-medium">Contenido</label>
        <div className="mt-2">
          <RichTextEditor name="content" defaultValue={defaultValues.content} placeholder="Escribí el editorial…" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues.status ?? "DRAFT"}
            className="mt-2 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>

        <label className="mt-7 flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="featured" defaultChecked={defaultValues.featured} />
          Destacado en home
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5"
        >
          Guardar
        </button>
        <a
          href={cancelHref}
          className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
