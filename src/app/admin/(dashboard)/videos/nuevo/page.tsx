export const dynamic = "force-dynamic";
import { createVideo } from "@/lib/actions/videos";

export default function NuevoVideoPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo video</h1>
      <p className="mt-1 text-principal/60">Pegá la URL del video de YouTube.</p>

      <form action={createVideo} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            name="title"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            rows={3}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">URL de YouTube</label>
          <input
            name="youtubeUrl"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=…"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Categoría</label>
          <input
            name="category"
            type="text"
            placeholder="Ej: Cultura"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue="PUBLISHED"
            className="mt-2 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/videos" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
