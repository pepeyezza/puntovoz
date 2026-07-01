export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ArticleCard from "@/components/editorial/ArticleCard";
import { EDITORIALES_DEMO } from "@/lib/demo-data";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Editoriales",
  description: "Artículos propios de .VOZ sobre desarrollo local, educación, cultura, política y producción.",
};

const CATEGORIAS = ["Todas", "Educación", "Tecnología", "Cultura", "Política y gestión", "Producción", "Comunidad"];

async function getEditoriales() {
  try {
    const posts = await prisma.post.findMany({
      where: { type: "EDITORIAL", status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { categories: true },
    });
    if (posts.length === 0) return EDITORIALES_DEMO;
    return posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? "",
      category: p.categories[0]?.name ?? "",
      date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
      coverImage: p.coverImage ?? undefined,
    }));
  } catch {
    return EDITORIALES_DEMO;
  }
}

export default async function EditorialesPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const header = await getPageHeader("editoriales", {
    eyebrow: "Editoriales",
    title: "Artículos propios de .VOZ",
    description: "Análisis y notas de producción propia sobre desarrollo local, educación, cultura, política y producción.",
  });

  const categoriaActiva = searchParams.categoria ?? "Todas";
  const todosLosEditoriales = await getEditoriales();

  const editoriales =
    categoriaActiva === "Todas"
      ? todosLosEditoriales
      : todosLosEditoriales.filter((e) => e.category === categoriaActiva);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        <p className="mt-4 text-principal/70">{header.description}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        {CATEGORIAS.map((cat) => (
          <a
            key={cat}
            href={cat === "Todas" ? "/editoriales" : `/editoriales?categoria=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
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
        <p className="mt-12 text-principal/60">
          Todavía no hay editoriales publicados en esta categoría.
        </p>
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
            />
          ))}
        </div>
      )}
    </section>
  );
}
