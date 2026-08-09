export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Microscope } from "lucide-react";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { getPageHeader } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Investigacion Cientifica - Data" };

async function get() {
  try {
    return await prisma.institucionCientifica.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { servicios: true } } },
    });
  } catch { return []; }
}

export default async function Page() {
  const header = await getPageHeader("dataInvestigacion", {
    eyebrow: "Data", title: "Investigacion cientifica",
    description: "Instituciones de investigacion y servicios cientificos en Chascomus.",
  });
  const instituciones = await get();

  return (
    <DataSeccionWrapper seccion="/observatorio/investigacion">
      <section className="mx-auto max-w-editorial px-5 py-12 lg:px-8">
        <p className="eyebrow text-principal/60">{header.eyebrow}</p>
        <div className="mt-3"><ObservatorioNav active="/observatorio/investigacion" /></div>
        <div className="mt-6 flex items-center gap-3">
          <Microscope size={32} className="text-principal/70" />
          <h1 className="font-display text-4xl">{header.title}</h1>
        </div>
        {header.description && <p className="mt-3 text-principal/70">{header.description}</p>}

        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavia no hay instituciones cargadas.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {instituciones.map((inst) => (
              <Link key={inst.id} href={`/observatorio/investigacion/${inst.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-principal/8 bg-secundario/80 transition-all hover:border-principal/20 hover:bg-secundario">
                {/* Imagen principal */}
                {(inst as any).imagen && (
                  <div className="relative aspect-video w-full">
                    <Image src={(inst as any).imagen} alt={inst.nombre} fill className="object-cover" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  {/* Logo + nombre */}
                  <div className="flex items-start gap-3">
                    {inst.logoUrl ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-principal/10 bg-white">
                        <Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-principal/10 font-display text-lg font-medium text-principal/35">
                        {inst.nombre.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xl leading-snug">{inst.nombre}</p>
                      <span className="mt-1 inline-block rounded-lg bg-principal/8 px-2.5 py-0.5 text-xs text-principal/50">
                        Institución científica
                      </span>
                      {inst.descripcion && <p className="mt-3 text-sm text-principal/60 leading-relaxed line-clamp-3">{inst.descripcion}</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-principal/40">{inst._count.servicios} servicio(s)</span>
                    <span className="text-xs font-medium text-acento opacity-0 transition-opacity group-hover:opacity-100">Ver servicios →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
