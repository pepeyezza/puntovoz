export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateAudio } from "@/lib/actions/audios";

export default async function EditarAudioPage({ params }: { params: { id: string } }) {
  const audio = await prisma.audio.findUnique({ where: { id: params.id } });
  if (!audio) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar audio</h1>
      <p className="mt-1 text-principal/60">{audio.title}</p>

      <form action={updateAudio.bind(null, audio.id)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={audio.title}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={audio.description ?? ""}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">URL de Spotify</label>
          <input
            name="spotifyUrl"
            type="url"
            required
            defaultValue={audio.spotifyUrl}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={audio.status}
            className="mt-2 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
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
