export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import OfertaAcademicaClient from "@/components/observatorio/OfertaAcademicaClient";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Oferta Académica - Data" };

async function get() {
  try {
    const instituciones = await prisma.institucionAcademica.findMany({ orderBy: { nombre: "asc" }, include: { _count: { select: { carreras: true } } } });
    return instituciones.map((i) => ({ id: i.id, slug: i.slug, nombre: i.nombre, tipo: i.tipo, descripcion: i.descripcion, logoUrl: i.logoUrl, carrerasCount: i._count.carreras }));
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataOfertaAcademica", { eyebrow: "Data", title: "Oferta académica", description: "Instituciones educativas, institutos y centros de formación en Chascomús." });
  const instituciones = await get();
  return (
    <DataSeccionWrapper seccion="/observatorio/oferta-academica">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-principal/60">{header.eyebrow}</p>
        <div className="mt-4"><ObservatorioNav active="/observatorio/oferta-academica" /></div>
        <div className="mt-8 flex items-center gap-3">
          <GraduationCap size={32} className="text-principal/70" />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}
        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <OfertaAcademicaClient instituciones={instituciones} />
        )}
      </section>
    </DataSeccionWrapper>
  );
}
