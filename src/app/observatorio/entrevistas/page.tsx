export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";
import { ENTREVISTAS_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Entrevistas · Observatorio",
  description: "Entrevistas a referentes y protagonistas del desarrollo local de Chascomús.",
};

async function getEntrevistas() {
  try {
    const entrevistas = await prisma.entrevista.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    if (entrevistas.length === 0) return ENTREVISTAS_DEMO;
    return entrevistas.map((e) => ({
      slug: e.slug,
      entrevistado: e.entrevistado,
      cargo: e.cargo ?? "",
      resumen: e.resumen,
      date: (e.publishedAt ?? e.createdAt).toLocaleDateString("es-AR"),
    }));
  } catch {
    return ENTREVISTAS_DEMO;
  }
}

export default async function EntrevistasPage() {
  const entrevistas = await getEntrevistas();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Entrevistas</h1>
        <p className="mt-4 text-principal/70">
          Voces de quienes construyen el desarrollo local desde distintos sectores.
        </p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio/entrevistas" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {entrevistas.map((e) => (
          <Link
            key={e.slug}
            href={`/observatorio/entrevistas/${e.slug}`}
            className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento"
          >
            <p className="font-display text-xl">{e.entrevistado}</p>
            <p className="mt-1 text-sm text-acento">{e.cargo}</p>
            <p className="mt-3 text-sm text-principal/60">{e.resumen}</p>
            <p className="mt-3 text-xs text-principal/40">{e.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
