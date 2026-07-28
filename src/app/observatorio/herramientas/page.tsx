export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import HerramientasClient from "@/components/observatorio/HerramientasClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { HERRAMIENTAS_DEMO } from "@/lib/herramientas";

export const metadata: Metadata = { title: "Tablero de herramientas - Data" };

async function get() {
  try {
    const h = await (prisma as any).herramientaTecnologica.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });
    return h.length ? h : HERRAMIENTAS_DEMO;
  } catch { return HERRAMIENTAS_DEMO; }
}

export default async function Page() {
  const header = await getPageHeader("dataHerramientas", {
    eyebrow: "Data",
    title: "Tablero de herramientas",
    description: "Apps, plataformas e inteligencia artificial para la gestión, comunicación y productividad.",
  });
  const herramientas = await get();

  return (
    <DataSeccionWrapper seccion="/observatorio/herramientas">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-principal/10">
            <Wrench size={28} className="text-principal/70" />
          </div>
          <p className="eyebrow mt-4 text-principal/60">{header.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
          {header.description && <p className="mt-4 text-principal/70">{header.description}</p>}
        </header>
        <div className="mt-10">
          <ObservatorioNav active="/observatorio/herramientas" />
        </div>
        <HerramientasClient herramientas={herramientas} />
      </section>
    </DataSeccionWrapper>
  );
}
