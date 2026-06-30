import type { Metadata } from "next";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { INDICADORES_DEMO } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Indicadores · Observatorio",
  description: "Indicadores socioeconómicos y productivos del partido de Chascomús.",
};

async function getIndicadores() {
  try {
    const indicadores = await prisma.indicador.findMany({ orderBy: { updatedAt: "desc" } });
    if (indicadores.length === 0) return INDICADORES_DEMO;
    return indicadores;
  } catch {
    return INDICADORES_DEMO;
  }
}

export default async function IndicadoresPage() {
  const indicadores = await getIndicadores();

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Indicadores</h1>
        <p className="mt-4 text-principal/70">
          Datos socioeconómicos y productivos del partido, actualizados por período.
        </p>
      </header>

      <div className="mt-10">
        <ObservatorioNav active="/observatorio/indicadores" />
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {indicadores.map((ind) => (
          <div key={ind.nombre + ind.periodo} className="rounded-2xl border border-principal/10 p-5">
            <p className="text-xs text-principal/50">{ind.categoria}</p>
            <p className="mt-2 text-sm text-principal/70">{ind.nombre}</p>
            <p className="mt-2 font-display text-3xl text-acento">
              {ind.valor}
              <span className="ml-1 text-base text-principal/50">{ind.unidad}</span>
            </p>
            <p className="mt-1 text-xs text-principal/40">{ind.periodo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
