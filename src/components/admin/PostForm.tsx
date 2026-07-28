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
    type?: string;
  };
  esNuevo?: boolean;
  hiddenFields?: Record<string, string>;
  cancelHref?: string;
  /** Muestra selector de tipo EDITORIAL vs COLABORADOR (para posts de colaboradores) */
  showTypeSelector?: boolean;
};

export default function PostForm({
  action,
  defaultValues = {},
  esNuevo = true,
  hiddenFields = {},
  cancelHref = "/admin/editoriales",
  showTypeSelector = false,
}: PostFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      {/* Campos ocultos */}
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {/* Selector de tipo — solo para colaboradores */}
      {showTypeSelector && (
        <div>
          <label className="text-sm font-medium">Tipo de publicación</label>
          <select
            name="type"
            defaultValue={defaultValues.type ?? "COLABORADOR"}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="COLABORADOR">Colaboración (aparece en mi perfil y en Editoriales)</option>
            <option value="EDITORIAL">Editorial (aparece directamente en Editoriales como nota propia)</option>
          </select>
        </div>
      )}

      {/* Si no hay showTypeSelector y no viene type en hiddenFields, usar EDITORIAL por defecto */}
      {!showTypeSelector && !hiddenFields.type && (
        <input type="hidden" name="type" value="EDITORIAL" />
      )}

      <div>
        <label className="text-sm font-medium">Título</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Subtítulo / bajada</label>
        <input
          name="subtitle"
          type="text"
          defaultValue={defaultValues.subtitle}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Contenido</label>
        <div className="mt-2">
          <RichTextEditor name="content" defaultValue={defaultValues.content ?? ""} />
        </div>
      </div>

      <ImageUploadField name="coverImage" defaultValue={defaultValues.coverImage} label="Imagen de portada" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <input
            name="category"
            type="text"
            defaultValue={defaultValues.category}
            placeholder="Ej: Educación"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Etiquetas</label>
          <input
            name="tags"
            type="text"
            defaultValue={defaultValues.tags}
            placeholder="tag1, tag2, tag3"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={defaultValues.status ?? "PUBLISHED"}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={defaultValues.featured}
              className="h-4 w-4 rounded accent-acento"
            />
            <span className="text-sm font-medium">Destacar en el home</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5"
        >
          Guardar
        </button>
        <a
          href={cancelHref}
          className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
