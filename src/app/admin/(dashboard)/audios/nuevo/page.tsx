import { createAudio } from "@/lib/actions/audios";

export default function NuevoAudioPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo audio</h1>
      <p className="mt-1 text-principal/60">Pegá la URL del episodio o playlist de Spotify.</p>

      <form action={createAudio} className="mt-8 max-w-xl space-y-5">
        <div>
          <label htmlFor="title" className="text-sm font-medium">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label htmlFor="spotifyUrl" className="text-sm font-medium">
            URL de Spotify (episodio o playlist)
          </label>
          <input
            id="spotifyUrl"
            name="spotifyUrl"
            type="url"
            required
            placeholder="https://open.spotify.com/episode/…"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium">
            Categoría
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="Ej: Producción"
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <select
            id="status"
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
          <a href="/admin/audios" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
