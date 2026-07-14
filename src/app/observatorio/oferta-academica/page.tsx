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
    const instituciones = await prisma.institucionAcademica.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { carreras: true } } },
    });
    return instituciones.map((i) => ({
      id: i.id, slug: i.slug, nombre: i.nombre, tipo: i.tipo,
      descripcion: i.descripcion, logoUrl: i.logoUrl,
      carrerasCount: i._count.carreras,
    }));
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataOfertaAcademica", {
    eyebrow: "Data",
    title: "Oferta académica",
    description: "Instituciones educativas, institutos y centros de formación en Chascomús.",
  });
  const instituciones = await get();

  return (
    <DataSeccionWrapper seccion="/observatorio/oferta-academica">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-joven/20">
            <GraduationCap size={28} className="text-principal" />
          </div>
          <p className="eyebrow mt-4 text-principal/60">{header.eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl">{header.title}</h1>
          {header.description && <p className="mt-4 text-principal/70">{header.description}</p>}
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/oferta-academica" /></div>
        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
        ) : (
          <OfertaAcademicaClient instituciones={instituciones} />
        )}
      </section>
    </DataSeccionWrapper>
  );
}
