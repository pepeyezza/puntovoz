import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory, createTag, deleteTag } from "@/lib/actions/taxonomy";

async function getData() {
  try {
    const [categorias, tags] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
      prisma.tag.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
    ]);
    return { categorias, tags };
  } catch {
    return { categorias: [], tags: [] };
  }
}

export default async function AdminCategoriasPage() {
  const { categorias, tags } = await getData();

  return (
    <div>
      <h1 className="font-display text-3xl">Categorías y etiquetas</h1>
      <p className="mt-1 text-principal/60">Organización temática de los contenidos.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {/* Categorías */}
        <div>
          <h2 className="font-display text-xl">Categorías</h2>

          <form action={createCategory} className="mt-4 flex gap-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Nueva categoría…"
              className="flex-1 rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
            <button type="submit" className="rounded-xl bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">
              Agregar
            </button>
          </form>

          <ul className="mt-5 space-y-2">
            {categorias.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-principal/10 px-4 py-2.5">
                <span className="text-sm">
                  {c.name} <span className="text-principal/40">({c._count.posts})</span>
                </span>
                <span className="flex items-center gap-3">
                  <Link href={`/admin/categorias/${c.id}/editar`} className="text-xs font-medium text-acento hover:underline">
                    Editar
                  </Link>
                  <form action={deleteCategory.bind(null, c.id)}>
                    <button type="submit" className="text-xs font-medium text-principal/50 hover:text-acento">
                      Eliminar
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Etiquetas */}
        <div>
          <h2 className="font-display text-xl">Etiquetas</h2>

          <form action={createTag} className="mt-4 flex gap-2">
            <input
              name="name"
              type="text"
              required
              placeholder="Nueva etiqueta…"
              className="flex-1 rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
            <button type="submit" className="rounded-xl bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">
              Agregar
            </button>
          </form>

          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t.id} className="flex items-center gap-2 rounded-full border border-principal/10 px-3 py-1.5 text-xs">
                #{t.name} <span className="text-principal/40">({t._count.posts})</span>
                <Link href={`/admin/categorias/etiquetas/${t.id}/editar`} className="text-principal/40 hover:text-acento">
                  ✎
                </Link>
                <form action={deleteTag.bind(null, t.id)}>
                  <button type="submit" className="text-principal/40 hover:text-acento">
                    ×
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
