export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";
import { esHtmlEnriquecido } from "@/lib/utils";

type Props = { params: { slug: string } };

async function getNota(slug: string) {
  try {
    const nota = await prisma.notaObservatorio.findUnique({ where: { slug } });
    if (nota) return { titulo: nota.titulo, contenido: nota.contenido, resumen: "", date: (nota.publishedAt ?? nota.createdAt).toLocaleDateString("es-AR") };
  } catch {
    // sigue al fallback
  }
  return NOTAS_OBSERVATORIO_DEMO.find((n) => n.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const nota = await getNota(params.slug);
  if (!nota) return {};
  return { title: nota.titulo, description: nota.resumen || nota.titulo };
}

export default async function NotaDetailPage({ params }: Props) {
  const nota = await getNota(params.slug);
  if (!nota) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16 lg:px-8">
      <Link href="/observatorio/notas" className="text-sm font-medium text-principal/60 hover:text-acento">
        ← Notas del Observatorio
      </Link>

      <p className="eyebrow mt-6 text-acento">Nota</p>
      <h1 className="mt-3 font-display text-4xl leading-tight">{nota.titulo}</h1>
      {nota.resumen && <p className="mt-4 text-lg text-principal/70">{nota.resumen}</p>}
      <p className="mt-4 text-sm text-principal/40">{nota.date}</p>

      <div className="mt-10 text-lg text-principal/90">
        {esHtmlEnriquecido(nota.contenido) ? (
          <div className="prose-voz" dangerouslySetInnerHTML={{ __html: nota.contenido }} />
        ) : (
          <div className="space-y-5 leading-relaxed">
            {nota.contenido.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
