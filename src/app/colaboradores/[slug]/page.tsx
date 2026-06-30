import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { COLABORADORES_DEMO, POSTS_COLABORADORES_DEMO } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

async function getColaborador(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: { where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } } },
    });
    if (user && user.role === "COLLABORATOR") {
      return {
        id: user.id,
        name: user.name,
        bio: user.bio ?? "",
        photoUrl: user.photoUrl ?? "",
        photoInitials: user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
        socials: Object.entries((user.socials as any) ?? {})
          .filter(([, v]) => v)
          .map(([label, href]) => ({ label, href: href as string })),
        posts: user.posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.subtitle ?? "",
          category: "",
          date: (p.publishedAt ?? p.createdAt).toLocaleDateString("es-AR"),
        })),
      };
    }
  } catch {
    // sigue al fallback
  }

  const demo = COLABORADORES_DEMO.find((c) => c.slug === id);
  if (!demo) return null;
  return {
    id: demo.slug,
    name: demo.name,
    bio: demo.bio,
    photoUrl: "",
    photoInitials: demo.photoInitials,
    socials: demo.socials,
    posts: POSTS_COLABORADORES_DEMO.filter((p) => p.authorSlug === demo.slug).map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      date: p.date,
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const colaborador = await getColaborador(params.slug);
  if (!colaborador) return {};
  return { title: colaborador.name, description: colaborador.bio };
}

export default async function ColaboradorDetailPage({ params }: Props) {
  const colaborador = await getColaborador(params.slug);
  if (!colaborador) notFound();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <Link href="/colaboradores" className="text-sm font-medium text-principal/60 hover:text-acento">
        ← Colaboradores
      </Link>

      <header className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-principal/10 font-display text-3xl text-principal/60">
          {colaborador.photoUrl ? (
            <Image src={colaborador.photoUrl} alt={colaborador.name} fill className="object-cover" />
          ) : (
            colaborador.photoInitials
          )}
        </div>
        <div>
          <h1 className="font-display text-4xl">{colaborador.name}</h1>
          <p className="mt-3 max-w-xl text-principal/70">{colaborador.bio}</p>
          <div className="mt-3 flex gap-4">
            {colaborador.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="text-sm font-medium text-acento hover:underline">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-14">
        <p className="eyebrow text-acento">Publicaciones</p>
        {colaborador.posts.length === 0 ? (
          <p className="mt-4 text-principal/60">Todavía no hay publicaciones de este colaborador.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {colaborador.posts.map((p) => (
              <Link
                key={p.slug}
                href={`/colaboradores/${colaborador.id}/${p.slug}`}
                className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
              >
                {p.category && <span className="eyebrow text-acento">{p.category}</span>}
                <p className="mt-2 font-display text-xl leading-snug">{p.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-principal/60">{p.excerpt}</p>
                <p className="mt-3 text-xs text-principal/40">{p.date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
