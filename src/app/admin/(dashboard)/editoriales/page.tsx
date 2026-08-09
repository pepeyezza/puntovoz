export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";
import ReorderableList from "@/components/admin/ReorderableList";

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { type: "EDITORIAL" },
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
      include: { author: true, categories: true },
    });
  } catch { return []; }
}

export default async function AdminEditorialesPage() {
  const posts = await getPosts();
  const items = posts.map((p) => ({
    id: p.id, title: p.title,
    subtitle: p.author?.name ?? "",
    badge: p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Borrador" : "Archivado",
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Editoriales</h1>
          <p className="mt-1 text-principal/60">Arrastra para reordenar y guarda.</p>
        </div>
        <Link href="/admin/editoriales/nuevo" className="rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo editorial
        </Link>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto]">
        <ReorderableList items={items} tipo="post" />
        <div className="flex flex-col gap-2 lg:w-36">
          {posts.map((p) => (
            <div key={p.id} className="flex gap-2 py-3.5">
              <Link href={`/admin/editoriales/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
              <form action={deletePost.bind(null, p.id)} className="inline">
                <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
