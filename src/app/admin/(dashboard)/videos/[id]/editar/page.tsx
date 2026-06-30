import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateVideo } from "@/lib/actions/videos";

export default async function EditarVideoPage({ params }: { params: { id: string } }) {
  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar video</h1>
      <p className="mt-1 text-principal/60">{video.title}</p>

      <form action={updateVideo.bind(null, video.id)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={video.title}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={video.description ?? ""}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">URL de YouTube</label>
          <input
            name="youtubeUrl"
            type="url"
            required
            defaultValue={video.youtubeUrl}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={video.status}
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
          <a href="/admin/videos" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
