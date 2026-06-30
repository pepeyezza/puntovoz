import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { COLABORADORES_DEMO, POSTS_COLABORADORES_DEMO } from "@/lib/demo-data";
import { esHtmlEnriquecido } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string; postSlug: string } };

async function getPost(authorId: string, postSlug: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: authorId } });
    if (user) {
      const post = await prisma.post.findUnique({ where: { slug: postSlug } });
      if (post && post.authorId === authorId) {
        return {
          colaborador: {
            id: user.id,
            name: user.name,
            photoUrl: user.photoUrl ?? "",
            photoInitials: user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          },
          post: { title: post.title, content: post.content, category: "", date: (post.publishedAt ?? post.createdAt).toLocaleDateString("es-AR") },
        };
      }
    }
  } catch {
    // sigue al fallback
  }

  const demoColaborador = COLABORADORES_DEMO.find((c) => c.slug === authorId);
  const demoPost = POSTS_COLABORADORES_DEMO.find((p) => p.slug === postSlug && p.authorSlug === authorId);
  if (!demoColaborador || !demoPost) return { colaborador: null, post: null };
  return {
    colaborador: { id: demoColaborador.slug, name: demoColaborador.name, photoUrl: "", photoInitials: demoColaborador.photoInitials },
    post: { title: demoPost.title, content: demoPost.content, category: demoPost.category, date: demoPost.date },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { post } = await getPost(params.slug, params.postSlug);
  if (!post) return {};
  return { title: post.title };
}

export default async function PostColaboradorPage({ params }: Props) {
  const { colaborador, post } = await getPost(params.slug, params.postSlug);
  if (!colaborador || !post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      <Link href={`/colaboradores/${colaborador.id}`} className="text-sm font-medium text-principal/60 hover:text-acento">
        ← {colaborador.name}
      </Link>

      {post.category && <p className="eyebrow mt-6 text-acento">{post.category}</p>}
      <h1 className="mt-3 font-display text-4xl leading-tight">{post.title}</h1>
      <div className="mt-6 flex items-center gap-3 text-sm text-principal/50">
        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-principal/10 text-xs font-semibold">
          {colaborador.photoUrl ? (
            <Image src={colaborador.photoUrl} alt={colaborador.name} fill className="object-cover" />
          ) : (
            colaborador.photoInitials
          )}
        </span>
        <span>{colaborador.name}</span>
        <span aria-hidden>·</span>
        <span>{post.date}</span>
      </div>

      <div className="mt-10 text-lg text-principal/90">
        {esHtmlEnriquecido(post.content) ? (
          <div className="prose-voz" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <div className="space-y-5 leading-relaxed">
            {post.content.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
