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
  const header = await getPageHeader("dataHerramientas", { eyebrow: "Data", title: "Tablero de herramientas", description: "Apps, plataformas e inteligencia artificial para la gestion, comunicacion y productividad." });
  const herramientas = await get();
  return (
    <DataSeccionWrapper seccion="/observatorio/herramientas">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow" style={{ color: "#6d28d9" }}>{header.eyebrow}</p>
        <div className="mt-3">
          <ObservatorioNav active="/observatorio/herramientas" />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Wrench size={32} style={{ color: "#6d28d9" }} />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}
        <HerramientasClient herramientas={herramientas} />
      </section>
    </DataSeccionWrapper>
  );
}
  );
}
