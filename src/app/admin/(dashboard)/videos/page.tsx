export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteVideo } from "@/lib/actions/videos";
import ReorderableList from "@/components/admin/ReorderableList";

async function getVideos() {
  try {
    return await prisma.video.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      include: { categories: true },
    });
  } catch { return []; }
}

export default async function AdminVideosPage() {
  const videos = await getVideos();
  const items = videos.map((v) => ({
    id: v.id,
    title: v.title,
    subtitle: v.categories[0]?.name ?? "",
    badge: `#${(v as any).orden ?? 0}`,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Videos</h1>
          <p className="mt-1 text-principal/60">Arrastrá para reordenar y guardá. También podés editar cada uno para cambiar el número.</p>
        </div>
        <Link href="/admin/videos/nuevo" className="rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nuevo video</Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto]">
        <ReorderableList items={items} tipo="video" />
        <div className="flex flex-col gap-2 lg:w-36">
          {videos.map((v) => (
            <div key={v.id} className="flex gap-2 py-3.5">
              <Link href={`/admin/videos/${v.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
              <form action={deleteVideo.bind(null, v.id)} className="inline">
                <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
