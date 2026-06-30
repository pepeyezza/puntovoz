import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";

async function getPosts() {
  try {
    return await prisma.post.findMany({
      where: { type: "EDITORIAL" },
      orderBy: { createdAt: "desc" },
      include: { author: true, categories: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminEditorialesPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Editoriales</h1>
          <p className="mt-1 text-principal/60">ABM de artículos propios de .VOZ.</p>
        </div>
        <Link href="/admin/editoriales/nuevo" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo editorial
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-principal/10">
        <table className="w-full text-sm">
          <thead className="bg-principal/[0.03] text-left text-principal/50">
            <tr>
              <th className="px-5 py-3 font-medium">Título</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Autor</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-principal/50">
                  Todavía no hay editoriales creados. Si esto es inesperado, verificá la conexión a la base de datos.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3 text-principal/60">{p.categories[0]?.name ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.status === "PUBLISHED"
                          ? "bg-joven/20 text-principal"
                          : p.status === "DRAFT"
                          ? "bg-principal/10 text-principal/60"
                          : "bg-acento/15 text-acento"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Borrador" : "Archivado"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-principal/60">{p.author?.name}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/editoriales/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                      Editar
                    </Link>
                    <form action={deletePost.bind(null, p.id)} className="inline">
                      <button type="submit" className="ml-4 text-sm font-medium text-principal/50 hover:text-acento">
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
