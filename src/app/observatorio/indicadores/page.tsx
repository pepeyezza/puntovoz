export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { BarChart2 } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import IndicadoresClient from "@/components/observatorio/IndicadoresClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { INDICADORES_DEMO } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Indicadores - Data" };

async function getIndicadores() {
  try {
    const ind = await prisma.indicador.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });
    return ind.length ? ind : INDICADORES_DEMO.map((i, idx) => ({ ...i, id: String(idx), fuente: null, updatedAt: new Date(), createdAt: new Date() }));
  } catch {
    return INDICADORES_DEMO.map((i, idx) => ({ ...i, id: String(idx), fuente: null, updatedAt: new Date(), createdAt: new Date() }));
  }
}

export default async function Page() {
  const header = await getPageHeader("dataIndicadores", { eyebrow: "Data", title: "Indicadores", description: "Principales métricas de desarrollo del partido de Chascomús." });
  const indicadores = await getIndicadores();
  return (
    <DataSeccionWrapper seccion="/observatorio/indicadores">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-joven">{header.eyebrow}</p>
        <div className="mt-4"><ObservatorioNav active="/observatorio/indicadores" /></div>
        <div className="mt-8 flex items-center gap-3">
          <BarChart2 size={32} className="text-joven" />
          <h1 className="font-display text-4xl text-secundario">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-secundario/70">{header.description}</p>}
        <IndicadoresClient indicadores={indicadores} />
      </section>
    </DataSeccionWrapper>
  );
}
