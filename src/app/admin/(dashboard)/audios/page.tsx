export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteAudio } from "@/lib/actions/audios";
import ReorderableList from "@/components/admin/ReorderableList";

async function getAudios() {
  try {
    return await prisma.audio.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      include: { categories: true },
    });
  } catch { return []; }
}

export default async function AdminAudiosPage() {
  const audios = await getAudios();
  const items = audios.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.categories[0]?.name ?? "",
    badge: `#${(a as any).orden ?? 0}`,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Audios</h1>
          <p className="mt-1 text-principal/60">Arrastrá para reordenar y guardá. También podés editar cada uno para cambiar el número.</p>
        </div>
        <Link href="/admin/audios/nuevo" className="rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nuevo audio</Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto]">
        <ReorderableList items={items} tipo="audio" />
        <div className="flex flex-col gap-2 lg:w-36">
          {audios.map((a) => (
            <div key={a.id} className="flex gap-2 py-3.5">
              <Link href={`/admin/audios/${a.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
              <form action={deleteAudio.bind(null, a.id)} className="inline">
                <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
