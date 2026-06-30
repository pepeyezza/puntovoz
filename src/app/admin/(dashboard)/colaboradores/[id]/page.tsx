import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/lib/actions/posts";

export default async function AdminColaboradorProfilePage({ params }: { params: { id: string } }) {
  const colaborador = await prisma.user.findUnique({
    where: { id: params.id },
    include: { posts: { orderBy: { createdAt: "desc" } } },
  });

  if (!colaborador) notFound();

  return (
    <div>
      <Link href="/admin/colaboradores" className="text-sm font-medium text-principal/60 hover:text-acento">
        ← Colaboradores
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">{colaborador.name}</h1>
          <p className="mt-1 text-principal/60">{colaborador.email}</p>
        </div>
        <Link href={`/admin/colaboradores/${colaborador.id}/editar`} className="rounded-full border border-principal/15 px-5 py-2.5 text-sm font-medium hover:border-acento hover:text-acento">
          Editar perfil
        </Link>
      </div>

      {colaborador.bio && <p className="mt-4 max-w-xl text-sm text-principal/70">{colaborador.bio}</p>}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl">Publicaciones</h2>
        <Link href={`/admin/colaboradores/${colaborador.id}/posts/nuevo`} className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-principal/10">
        <table className="w-full text-sm">
          <thead className="bg-principal/[0.03] text-left text-principal/50">
            <tr>
              <th className="px-5 py-3 font-medium">Título</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {colaborador.posts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-principal/50">
                  Este colaborador todavía no tiene publicaciones.
                </td>
              </tr>
            ) : (
              colaborador.posts.map((p) => (
                <tr key={p.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{p.title}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.status === "PUBLISHED" ? "bg-joven/20 text-principal" : "bg-principal/10 text-principal/60"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "Publicado" : p.status === "DRAFT" ? "Borrador" : "Archivado"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/colaboradores/${colaborador.id}/posts/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                      Editar
                    </Link>
                    <form action={deletePost.bind(null, p.id)} className="ml-4 inline">
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
