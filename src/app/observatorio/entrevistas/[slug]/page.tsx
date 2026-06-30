import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ENTREVISTAS_DEMO } from "@/lib/demo-data";
import { esHtmlEnriquecido } from "@/lib/utils";

type Props = { params: { slug: string } };

async function getEntrevista(slug: string) {
  try {
    const entrevista = await prisma.entrevista.findUnique({ where: { slug } });
    if (entrevista) return entrevista;
  } catch {
    // sigue al fallback
  }
  const demo = ENTREVISTAS_DEMO.find((e) => e.slug === slug);
  if (!demo) return null;
  return { ...demo, createdAt: new Date(), publishedAt: new Date() };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entrevista = await getEntrevista(params.slug);
  if (!entrevista) return {};
  return { title: `Entrevista a ${entrevista.entrevistado}`, description: entrevista.resumen };
}

export default async function EntrevistaDetailPage({ params }: Props) {
  const entrevista = await getEntrevista(params.slug);
  if (!entrevista) notFound();

  const fecha = (entrevista as any).date ?? (entrevista.publishedAt ?? entrevista.createdAt).toLocaleDateString("es-AR");

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      <Link href="/observatorio/entrevistas" className="text-sm font-medium text-principal/60 hover:text-acento">
        ← Entrevistas
      </Link>

      <p className="eyebrow mt-6 text-acento">Entrevista</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{entrevista.entrevistado}</h1>
      <p className="mt-2 text-lg text-acento">{entrevista.cargo}</p>
      <p className="mt-4 text-principal/70">{entrevista.resumen}</p>
      <p className="mt-4 text-sm text-principal/40">{fecha}</p>

      <div className="mt-10 text-lg text-principal/90">
        {esHtmlEnriquecido(entrevista.contenido) ? (
          <div className="prose-voz" dangerouslySetInnerHTML={{ __html: entrevista.contenido }} />
        ) : (
          <div className="space-y-5 leading-relaxed">
            {entrevista.contenido.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
