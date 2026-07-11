export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Oferta Academica - Data" };

const TIPO_LABEL: Record<string,string> = { universidad:"Universidad", instituto:"Instituto", formacion_laboral:"Centro de formacion", otro:"Otro" };
const TIPOS = ["Todas", "Universidad", "Instituto", "Centro de formacion", "Otro"];

async function get() {
  try { return await prisma.institucionAcademica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{carreras:true}}} }); }
  catch { return []; }
}

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const header = await getPageHeader("dataOfertaAcademica", {
    eyebrow: "Data",
    title: "Oferta academica",
    description: "Instituciones educativas, institutos y centros de formacion en Chascomus.",
  });
  const instituciones = await get();
  const tipoActivo = searchParams.tipo ?? "Todas";
  const filtradas = tipoActivo === "Todas" ? instituciones : instituciones.filter((i) => TIPO_LABEL[i.tipo] === tipoActivo);

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
        <div className="mt-8 flex flex-wrap gap-2">
          {TIPOS.map((tipo) => (
            <a key={tipo} href={tipo === "Todas" ? "/observatorio/oferta-academica" : `/observatorio/oferta-academica?tipo=${encodeURIComponent(tipo)}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${tipoActivo === tipo ? "border-principal bg-principal text-secundario" : "border-principal/20 hover:border-principal hover:bg-principal/10"}`}>
              {tipo}
            </a>
          ))}
        </div>
        {filtradas.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavia no hay instituciones cargadas.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((inst) => (
              <Link key={inst.id} href={`/observatorio/oferta-academica/${inst.slug}`} className="block rounded-2xl bg-secundario/70 p-6 transition-colors hover:bg-secundario">
                <div className="flex items-center gap-4">
                  {inst.logoUrl ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-joven/20 font-display text-xl text-principal/60">{inst.nombre.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-display text-lg leading-snug">{inst.nombre}</p>
                    <p className="text-xs text-principal/50">{TIPO_LABEL[inst.tipo] ?? inst.tipo}</p>
                  </div>
                </div>
                {inst.descripcion && <p className="mt-3 text-sm text-principal/60 line-clamp-2">{inst.descripcion}</p>}
                <p className="mt-3 text-xs text-principal/40">{inst._count.carreras} carrera(s)</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
