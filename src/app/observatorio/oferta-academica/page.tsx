export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Search } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Oferta Academica - Data" };

const TIPO_LABEL: Record<string, string> = {
  universidad: "Universidad",
  instituto: "Instituto",
  formacion_laboral: "Centro de formacion",
  otro: "Otro",
};

const TIPO_COLOR: Record<string, string> = {
  universidad: "bg-joven/20 text-principal",
  instituto: "bg-acento/15 text-acento",
  formacion_laboral: "bg-principal/10 text-principal/60",
  otro: "bg-principal/5 text-principal/50",
};

async function get() {
  try {
    return await prisma.institucionAcademica.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { carreras: true } } },
    });
  } catch { return []; }
}

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const header = await getPageHeader("dataOfertaAcademica", {
    eyebrow: "Data", title: "Oferta academica",
    description: "Instituciones educativas, institutos y centros de formacion en Chascomus.",
  });
  const instituciones = await get();
  const tipoActivo = searchParams.tipo ?? "Todas";
  const filtradas = tipoActivo === "Todas"
    ? instituciones
    : instituciones.filter((i) => TIPO_LABEL[i.tipo] === tipoActivo);

  const TIPOS = ["Todas", "Universidad", "Instituto", "Centro de formacion", "Otro"];

  return (
    <DataSeccionWrapper seccion="/observatorio/oferta-academica">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-principal/60">{header.eyebrow}</p>
        <div className="mt-3"><ObservatorioNav active="/observatorio/oferta-academica" /></div>
        <div className="mt-6 flex items-center gap-3">
          <GraduationCap size={32} className="text-principal/70" />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

        {/* Filtros */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TIPOS.map((tipo) => (
            <a key={tipo}
              href={tipo === "Todas" ? "/observatorio/oferta-academica" : `/observatorio/oferta-academica?tipo=${encodeURIComponent(tipo)}`}
              className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition-colors ${
                tipoActivo === tipo ? "border-principal bg-principal text-secundario" : "border-principal/15 hover:border-principal hover:bg-principal/5"
              }`}>
              {tipo}
            </a>
          ))}
        </div>

        {filtradas.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavia no hay instituciones cargadas.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((inst) => (
              <Link key={inst.id} href={`/observatorio/oferta-academica/${inst.slug}`}
                className="group flex flex-col rounded-2xl border border-principal/10 bg-secundario/60 p-6 transition-all hover:border-principal/30 hover:bg-secundario">
                {/* Logo o inicial */}
                <div className="flex items-start gap-4">
                  {inst.logoUrl ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10 bg-white">
                      <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-2" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-joven/20 font-display text-2xl font-medium text-principal/40">
                      {inst.nombre.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg leading-snug">{inst.nombre}</p>
                    <span className={`mt-1 inline-block rounded-lg px-2.5 py-0.5 text-xs font-semibold ${TIPO_COLOR[inst.tipo] ?? "bg-principal/5 text-principal/50"}`}>
                      {TIPO_LABEL[inst.tipo] ?? inst.tipo}
                    </span>
                  </div>
                </div>
                {/* Descripción */}
                {inst.descripcion && (
                  <p className="mt-4 flex-1 text-sm text-principal/60 leading-relaxed line-clamp-3">{inst.descripcion}</p>
                )}
                {/* Footer de la card */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-principal/40">{inst._count.carreras} carrera(s)</span>
                  <span className="text-xs font-medium text-principal/40 opacity-0 transition-opacity group-hover:opacity-100">Ver carreras →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
