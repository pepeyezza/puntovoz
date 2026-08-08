export const dynamic = "force-dynamic";
import { createAudio } from "@/lib/actions/audios";

export default function NuevoAudioPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">Nuevo audio</h1>
      <p className="mt-1 text-principal/60">Pega la URL del episodio o playlist de Spotify.</p>
      <form action={createAudio} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Titulo</label>
          <input name="title" type="text" required className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripcion</label>
          <textarea name="description" rows={3} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">URL de Spotify</label>
          <input name="spotifyUrl" type="url" required placeholder="https://open.spotify.com/episode/..." className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoria</label>
          <input name="category" type="text" placeholder="Ej: Produccion" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Orden de aparicion</label>
          <p className="text-xs text-principal/40 mt-0.5">1 = primero, 2 = segundo, etc. Dejar en 0 para al final.</p>
          <input name="orden" type="number" defaultValue="0" min="0" className="mt-2 w-24 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select name="status" defaultValue="PUBLISHED" className="mt-2 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">Guardar</button>
          <a href="/admin/audios" className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
