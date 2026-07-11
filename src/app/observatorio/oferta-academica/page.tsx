export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Oferta Académica · Data", description: "Instituciones educativas y carreras disponibles en Chascomús." };

const TIPO_LABEL: Record<string,string> = { universidad:"Universidad", instituto:"Instituto", formacion_laboral:"Centro de formación", otro:"Otro" };
const TIPOS = ["Todas", "Universidad", "Instituto", "Centro de formación", "Otro"];

async function get() { try { return await prisma.institucionAcademica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{carreras:true}}} }); } catch { return []; } }

export default async function Page({ searchParams }: { searchParams: { tipo?: string } }) {
  const instituciones = await get();
  const tipoActivo = searchParams.tipo ?? "Todas";
  const filtradas = tipoActivo === "Todas" ? instituciones : instituciones.filter((i) => TIPO_LABEL[i.tipo] === tipoActivo);

  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Oferta académica</h1>
        <p className="mt-4 text-principal/70">Instituciones educativas, institutos y centros de formación disponibles en Chascomús.</p>
      </header>
      <div className="mt-10"><ObservatorioNav active="/observatorio/oferta-academica" /></div>
      <div className="mt-8 flex flex-wrap gap-2">
        {TIPOS.map((tipo) => (
          <a key={tipo} href={tipo === "Todas" ? "/observatorio/oferta-academica" : `/observatorio/oferta-academica?tipo=${encodeURIComponent(tipo)}`} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${tipoActivo === tipo ? "border-acento bg-acento text-secundario" : "border-principal/15 hover:border-acento hover:text-acento"}`}>
            {tipo}
          </a>
        ))}
      </div>
      {filtradas.length === 0 ? (
        <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((inst) => (
            <Link key={inst.id} href={`/observatorio/oferta-academica/${inst.slug}`} className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
              <div className="flex items-center gap-4">
                {inst.logoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-principal/5 font-display text-xl text-principal/30">{inst.nombre.charAt(0)}</div>
                )}
                <div>
                  <p className="font-display text-lg leading-snug">{inst.nombre}</p>
                  <p className="text-xs text-acento">{TIPO_LABEL[inst.tipo] ?? inst.tipo}</p>
                </div>
              </div>
              {inst.descripcion && <p className="mt-3 text-sm text-principal/60 line-clamp-2">{inst.descripcion}</p>}
              <p className="mt-3 text-xs text-principal/40">{inst._count.carreras} carrera(s)</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
