export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArticleCard from "@/components/editorial/ArticleCard";
import { EDITORIALES_DEMO } from "@/lib/demo-data";
import { esHtmlEnriquecido } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

async function getEditorial(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { categories: true, tags: true, author: true },
    });
    if (post && post.type === "EDITORIAL") {
      return {
        title: post.title,
        subtitle: post.subtitle ?? "",
        content: post.content,
        category: post.categories[0]?.name ?? "",
        tags: post.tags.map((t) => t.name),
        author: post.author?.name ?? "Redacción .VOZ",
        date: (post.publishedAt ?? post.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }),
        coverImage: post.coverImage ?? "",
      };
    }
  } catch { /* sigue al fallback */ }
  return EDITORIALES_DEMO.find((e) => e.slug === slug) ?? null;
}

async function getRelacionados(slugActual: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { type: "EDITORIAL", status: "PUBLISHED", slug: { not: slugActual } },
      orderBy: { publishedAt: "desc" },
      take: 2,
      include: { categories: true },
    });
    if (posts.length > 0) {
      return posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? "",
        category: p.categories[0]?.name ?? "",
        date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR"),
        coverImage: p.coverImage ?? undefined,
      }));
    }
  } catch { /* sigue al fallback */ }
  return EDITORIALES_DEMO.filter((e) => e.slug !== slugActual).slice(0, 2);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const editorial = await getEditorial(params.slug);
  if (!editorial) return {};
  return { title: editorial.title, description: editorial.subtitle };
}

export default async function EditorialDetailPage({ params }: Props) {
  const editorial = await getEditorial(params.slug);
  if (!editorial) notFound();
  const relacionados = await getRelacionados(params.slug);

  return (
    <article>
      <header className="mx-auto max-w-2xl px-5 pt-16 lg:px-8">
        <Link href="/editoriales" className="text-sm font-medium text-principal/60 hover:text-acento">← Editoriales</Link>
        <p className="eyebrow mt-6 text-acento">{editorial.category}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight lg:text-5xl">{editorial.title}</h1>
        <p className="mt-4 text-lg text-principal/70">{editorial.subtitle}</p>
        <div className="mt-6 flex items-center gap-3 text-sm text-principal/50">
          <span>{editorial.author}</span>
          <span aria-hidden>·</span>
          <span>{editorial.date}</span>
        </div>
      </header>

      <div className="mx-auto mt-10 max-w-editorial overflow-hidden rounded-2xl">
        {editorial.coverImage ? (
          <div className="relative aspect-[16/9] w-full">
            <Image src={editorial.coverImage} alt={editorial.title} fill className="object-cover" priority />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-principal/5 text-principal/30">.VOZ</div>
        )}
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12 lg:px-8">
        {esHtmlEnriquecido(editorial.content) ? (
          <div className="prose-voz text-lg text-principal/90" dangerouslySetInnerHTML={{ __html: editorial.content }} />
        ) : (
          <div className="space-y-5 text-lg leading-relaxed text-principal/90">
            {editorial.content.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
        {editorial.tags && editorial.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {editorial.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-principal/5 px-4 py-1.5 text-xs font-medium text-principal/60">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-editorial border-t border-principal/10 px-5 py-16 lg:px-8">
          <p className="eyebrow text-acento">Contenido relacionado</p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {relacionados.map((r) => (
              <ArticleCard key={r.slug} slug={r.slug} title={r.title} subtitle={r.subtitle} category={r.category} date={r.date} coverImage={r.coverImage} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
