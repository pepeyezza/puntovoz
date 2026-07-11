export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import DataSeccionWrapper from "@/components/observatorio/DataSeccionWrapper";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Investigacion Cientifica - Data" };

async function get() {
  try { return await prisma.institucionCientifica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{servicios:true}}} }); }
  catch { return []; }
}

export default async function Page() {
  const instituciones = await get();
  return (
    <DataSeccionWrapper seccion="/observatorio/investigacion">
      <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
        <header className="max-w-2xl">
          <p className="eyebrow text-principal/60">Data</p>
          <h1 className="mt-2 font-display text-4xl">Investigacion cientifica</h1>
          <p className="mt-4 text-principal/70">Instituciones de investigacion y servicios cientificos en Chascomus.</p>
        </header>
        <div className="mt-10"><ObservatorioNav active="/observatorio/investigacion" /></div>
        {instituciones.length === 0 ? (
          <p className="mt-12 text-principal/50">Todavia no hay instituciones cargadas.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instituciones.map((inst) => (
              <Link key={inst.id} href={`/observatorio/investigacion/${inst.slug}`} className="block rounded-2xl bg-secundario/80 p-6 transition-colors hover:bg-secundario">
                <div className="flex items-center gap-4">
                  {inst.logoUrl ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-principal/10 font-display text-xl text-principal/40">{inst.nombre.charAt(0)}</div>
                  )}
                  <p className="font-display text-lg leading-snug">{inst.nombre}</p>
                </div>
                {inst.descripcion && <p className="mt-3 text-sm text-principal/60 line-clamp-2">{inst.descripcion}</p>}
                <p className="mt-3 text-xs text-principal/40">{inst._count.servicios} servicio(s)</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </DataSeccionWrapper>
  );
}
