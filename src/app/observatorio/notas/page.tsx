export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NOTAS_OBSERVATORIO_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Notas - Data" };

async function getNotas() {
  try {
    const notas = await prisma.notaObservatorio.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
    if (notas.length === 0) return NOTAS_OBSERVATORIO_DEMO;
    return notas.map((n) => ({ slug: n.slug, titulo: n.titulo, resumen: n.contenido.replace(/<[^>]+>/g, "").slice(0, 140) + "...", date: (n.publishedAt ?? n.createdAt).toLocaleDateString("es-AR") }));
  } catch { return NOTAS_OBSERVATORIO_DEMO; }
}

export default async function Page() {
  const header = await getPageHeader("dataNotas", { eyebrow: "Data", title: "Notas sobre desarrollo local", description: "Analisis propios que cruzan datos, proyectos y contexto del partido." });
  const notas = await getNotas();
  return (
    <DataSeccionWrapper seccion="/observatorio/notas">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-principal/60">{header.eyebrow}</p>
        <div className="mt-3">
          <ObservatorioNav active="/observatorio/notas" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <FileText size={32} className="text-principal/70" />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {notas.map((n) => (
            <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-2xl border border-joven/30 bg-secundario/60 p-6 transition-colors hover:border-joven">
              <p className="font-display text-xl">{n.titulo}</p>
              <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
              <p className="mt-3 text-xs text-principal/40">{n.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </DataSeccionWrapper>
  );
}
