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
    const instituciones = await prisma.institucionCientifica.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { servicios: true } } },
    });
    return instituciones.map((i) => ({
      id: i.id, slug: i.slug, nombre: i.nombre,
      descripcion: i.descripcion, logoUrl: i.logoUrl,
      serviciosCount: i._count.servicios,
    }));
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataInvestigacion", {
    eyebrow: "Data",
    title: "Investigación científica",
    description: "Instituciones de investigación y servicios científicos en Chascomús.",
  });
  const instituciones = await get();

  return (
    <DataSeccionWrapper seccion="/observatorio/investigacion">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-principal/10">
            <Microscope size={28} className="text-principal" />
          </div>
          <p className="eyebrow mt-4 text-principal/60">{header.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
          {header.description && <p className="mt-4 text-principal/70">{header.description}</p>}
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/investigacion" /></div>
        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <InvestigacionClient instituciones={instituciones} />
        )}
      </section>
    </DataSeccionWrapper>
  );
}
