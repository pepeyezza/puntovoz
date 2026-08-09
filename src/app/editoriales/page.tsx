export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ArticleCard from "@/components/editorial/ArticleCard";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { EDITORIALES_DEMO } from "@/lib/demo-data";
import { CATEGORIAS_VOZ } from "@/lib/categorias";

export const metadata: Metadata = {
  title: "Editoriales",
  description: "Artículos propios de .VOZ.",
};

async function getEditoriales() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        // Muestra tanto editoriales propios como publicaciones de colaboradores
        type: { in: ["EDITORIAL", "COLABORADOR"] },
      },
     orderBy: [{ orden: "asc" }, { publishedAt: "desc" }],
      include: { categories: true, author: true },
    });
    if (posts.length === 0) return EDITORIALES_DEMO;
    return posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? "",
      category: p.categories[0]?.name ?? "",
      date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
      coverImage: p.coverImage ?? undefined,
      featured: p.featured,
      author: p.author?.name ?? "",
      isColaborador: p.type === "COLABORADOR",
    }));
  } catch {
    return EDITORIALES_DEMO;
  }
}

export default async function EditorialesPage({ searchParams }: { searchParams: { categoria?: string } }) {
  const header = await getPageHeader("editoriales", {
    eyebrow: "Editoriales",
    title: "Artículos de .VOZ",
    description: "Producciones propias y voces colaboradoras.",
  });
  const categoriaActiva = searchParams.categoria ?? "Todas";
  const todos = await getEditoriales();
  const editoriales = categoriaActiva === "Todas" ? todos : todos.filter((e) => e.category === categoriaActiva);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        {["Todas", ...CATEGORIAS_VOZ].map((cat) => (
          <a
            key={cat}
            href={cat === "Todas" ? "/editoriales" : `/editoriales?categoria=${encodeURIComponent(cat)}`}
            className={`rounded-lg border px-5 py-2 text-sm font-medium transition-colors ${
              categoriaActiva === cat
                ? "border-acento bg-acento text-secundario"
                : "border-principal/15 hover:border-acento hover:text-acento"
            }`}
          >
            {cat}
          </a>
        ))}
      </div>

      {editoriales.length === 0 ? (
        <p className="mt-12 text-principal/60">No hay publicaciones en esta categoría.</p>
      ) : (
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {editoriales.map((e) => (
            <ArticleCard
              key={e.slug}
              slug={e.slug}
              title={e.title}
              subtitle={e.subtitle}
              category={e.category}
              date={e.date}
              coverImage={e.coverImage}
              featured={(e as any).featured}
              author={(e as any).isColaborador ? (e as any).author : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
