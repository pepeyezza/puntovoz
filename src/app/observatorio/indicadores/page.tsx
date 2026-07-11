export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Indicadores · Data", description: "Indicadores de desarrollo local de Chascomús." };

async function getIndicadores() {
  try {
    const ind = await prisma.indicador.findMany({ orderBy: { updatedAt: "desc" } });
    return ind.length ? ind : INDICADORES_DEMO;
  } catch { return INDICADORES_DEMO; }
}

export default async function IndicadoresPage() {
  const indicadores = await getIndicadores();
  return (
    <DataSeccionWrapper seccion="/observatorio/indicadores">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <p className="eyebrow text-joven">Data</p>
          <h1 className="mt-2 font-display text-4xl text-secundario">Indicadores</h1>
          <p className="mt-4 text-secundario/70">Principales métricas de desarrollo del partido de Chascomús.</p>
        </header>
        <div className="mt-10">
          <ObservatorioNav active="/observatorio/indicadores" />
        </div>
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
