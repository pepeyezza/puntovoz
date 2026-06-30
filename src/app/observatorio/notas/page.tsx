import type { Metadata } from "next";
import Link from "next/link";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";
import { NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Notas · Observatorio",
  description: "Notas de análisis sobre desarrollo local en Chascomús.",
};

async function getNotas() {
  try {
    const notas = await prisma.notaObservatorio.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    if (notas.length === 0) return NOTAS_OBSERVATORIO_DEMO;
    return notas.map((n) => ({
      slug: n.slug,
      titulo: n.titulo,
      resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 140) + "…",
      date: (n.publishedAt ?? n.createdAt).toLocaleDateString("es-AR"),
    }));
  } catch {
    return NOTAS_OBSERVATORIO_DEMO;
  }
}

export default async function NotasPage() {
  const notas = await getNotas();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Notas sobre desarrollo local</h1>
        <p className="mt-4 text-principal/70">
          Análisis propios que cruzan datos, proyectos y contexto del partido.
        </p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio/notas" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {notas.map((n) => (
          <Link
            key={n.slug}
            href={`/observatorio/notas/${n.slug}`}
            className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
          >
            <p className="font-display text-xl">{n.titulo}</p>
            <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
            <p className="mt-3 text-xs text-principal/40">{n.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
