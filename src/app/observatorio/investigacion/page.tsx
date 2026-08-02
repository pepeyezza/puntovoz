export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Microscope } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import InvestigacionClient from "@/components/observatorio/InvestigacionClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Investigación Científica - Data" };

async function get() {
  try {
    const instituciones = await prisma.institucionCientifica.findMany({ orderBy: { nombre: "asc" }, include: { _count: { select: { servicios: true } } } });
    return instituciones.map((i) => ({ id: i.id, slug: i.slug, nombre: i.nombre, descripcion: i.descripcion, logoUrl: i.logoUrl, serviciosCount: i._count.servicios }));
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataInvestigacion", { eyebrow: "Data", title: "Investigación científica", description: "Instituciones de investigación y servicios científicos en Chascomús." });
  const instituciones = await get();
  return (
    <DataSeccionWrapper seccion="/observatorio/investigacion">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-principal/60">{header.eyebrow}</p>
        <div className="mt-4"><ObservatorioNav active="/observatorio/investigacion" /></div>
        <div className="mt-8 flex items-center gap-3">
          <Microscope size={32} className="text-principal/70" />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}
        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <InvestigacionClient instituciones={instituciones} />
        )}
      </section>
    </DataSeccionWrapper>
  );
}
