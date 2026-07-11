export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { BarChart2 } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Indicadores - Data" };

async function getIndicadores() {
  try {
    const ind = await prisma.indicador.findMany({ orderBy: { updatedAt: "desc" } });
    return ind.length ? ind : INDICADORES_DEMO;
  } catch { return INDICADORES_DEMO; }
}

export default async function Page() {
  const header = await getPageHeader("dataIndicadores", {
    eyebrow: "Data",
    title: "Indicadores",
    description: "Principales metricas de desarrollo del partido de Chascomus.",
  });
  const indicadores = await getIndicadores();

  return (
    <DataSeccionWrapper seccion="/observatorio/indicadores">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-joven/20">
            <BarChart2 size={28} className="text-joven" />
          </div>
          <p className="eyebrow mt-4 text-joven">{header.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl text-secundario">{header.title}</h1>
          {header.description && <p className="mt-4 text-secundario/70">{header.description}</p>}
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/indicadores" /></div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {indicadores.map((ind) => (
            <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-secundario/15 p-5">
              <p className="text-xs text-secundario/50">{ind.categoria}</p>
              <p className="mt-2 text-sm text-secundario/70">{ind.nombre}</p>
              <p className="mt-2 font-display text-3xl text-joven">
                {ind.valor}<span className="ml-1 text-base text-secundario/50">{ind.unidad}</span>
              </p>
              <p className="mt-1 text-xs text-secundario/40">{ind.periodo}</p>
            </div>
          ))}
        </div>
      </section>
    </DataSeccionWrapper>
  );
}
