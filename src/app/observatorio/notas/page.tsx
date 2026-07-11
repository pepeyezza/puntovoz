export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
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
  const header = await getPageHeader("dataNotas", {
    eyebrow: "Data",
    title: "Notas sobre desarrollo local",
    description: "Analisis propios que cruzan datos, proyectos y contexto del partido.",
  });
  const notas = await getNotas();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-principal/5">
          <FileText size={28} className="text-principal/60" />
        </div>
        <p className="eyebrow mt-4 text-acento">{header.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
        {header.description && <p className="mt-4 text-principal/70">{header.description}</p>}
      </header>
      <div className="mt-10"><ObservatorioNav active="/observatorio/notas" /></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {notas.map((n) => (
          <Link key={n.slug} href={`/observatorio/notas/${n.slug}`} className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
            <p className="font-display text-xl">{n.titulo}</p>
            <p className="mt-2 text-sm text-principal/60">{n.resumen}</p>
            <p className="mt-3 text-xs text-principal/40">{n.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
