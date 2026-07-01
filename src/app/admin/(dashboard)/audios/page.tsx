export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAudio } from "@/lib/actions/audios";

async function getAudios() {
  try {
    return await prisma.audio.findMany({ orderBy: { createdAt: "desc" }, include: { categories: true } });
  } catch {
    return [];
  }
}

export default async function AdminAudiosPage() {
  const audios = await getAudios();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Audios</h1>
          <p className="mt-1 text-principal/60">Episodios y playlists embebidos desde Spotify.</p>
        </div>
        <Link href="/admin/audios/nuevo" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo audio
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-principal/10">
        <table className="w-full text-sm">
          <thead className="bg-principal/[0.03] text-left text-principal/50">
            <tr>
              <th className="px-5 py-3 font-medium">Título</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {audios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-principal/50">
                  Todavía no hay audios cargados.
                </td>
              </tr>
            ) : (
              audios.map((a) => (
                <tr key={a.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{a.title}</td>
                  <td className="px-5 py-3 text-principal/60">{a.categories[0]?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === "PUBLISHED" ? "bg-joven/20 text-principal" : "bg-principal/10 text-principal/60"
                      }`}
                    >
                      {a.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/audios/${a.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                      Editar
                    </Link>
                    <form action={deleteAudio.bind(null, a.id)} className="ml-4 inline">
                      <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
