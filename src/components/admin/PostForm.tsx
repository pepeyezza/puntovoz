"use client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";
import Image from "next/image";

type User = { id: string; name: string; photoUrl: string | null };

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
    authorId?: string;
  };
  esNuevo?: boolean;
  hiddenFields?: Record<string, string>;
  cancelHref?: string;
  showTypeSelector?: boolean;
  users?: User[];
};

export default function PostForm({
  action,
  defaultValues = {},
  esNuevo = true,
  hiddenFields = {},
  cancelHref = "/admin/editoriales",
  showTypeSelector = false,
  users = [],
}: PostFormProps) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {showTypeSelector && (
        <div>
          <label className="text-sm font-medium">Tipo de publicacion</label>
          <select name="type" defaultValue={defaultValues.type ?? "COLABORADOR"}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="COLABORADOR">Colaboracion (aparece en mi perfil y en Editoriales)</option>
            <option value="EDITORIAL">Editorial (aparece directamente en Editoriales)</option>
          </select>
        </div>
      )}

      {!showTypeSelector && !hiddenFields.type && (
        <input type="hidden" name="type" value="EDITORIAL" />
      )}

      {/* Selector de autor */}
      {users.length > 0 && (
        <div>
          <label className="text-sm font-medium">Autor</label>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <select name="authorId" defaultValue={defaultValues.authorId}
              className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {/* Preview del autor seleccionado */}
            <div className="flex flex-wrap gap-2 mt-1">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 cursor-pointer rounded-xl border border-principal/10 px-3 py-2 hover:border-acento has-[:checked]:border-acento has-[:checked]:bg-acento/5">
                  <input type="radio" name="authorId" value={u.id}
                    defaultChecked={u.id === defaultValues.authorId}
                    className="sr-only" />
                  {u.photoUrl ? (
                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-principal/10">
                      <Image src={u.photoUrl} alt={u.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-principal/10 text-xs font-bold text-principal/50">
                      {u.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Titulo</label>
        <input name="title" type="text" required defaultValue={defaultValues.title}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
      </div>

      <div>
        <label className="text-sm font-medium">Subtitulo / bajada</label>
        <input name="subtitle" type="text" defaultValue={defaultValues.subtitle}
          className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
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
          <label className="text-sm font-medium">Categoria</label>
          <input name="category" type="text" defaultValue={defaultValues.category} placeholder="Ej: Educacion"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Etiquetas</label>
          <input name="tags" type="text" defaultValue={defaultValues.tags} placeholder="tag1, tag2"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select name="status" defaultValue={defaultValues.status ?? "PUBLISHED"}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={defaultValues.featured} className="h-4 w-4 rounded accent-acento" />
            <span className="text-sm font-medium">Destacar en el home</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          Guardar
        </button>
        <a href={cancelHref} className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
          Cancelar
        </a>
      </div>
    </form>
  );
}
