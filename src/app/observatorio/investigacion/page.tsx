export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ObservatorioNav from "@/components/observatorio/ObservatorioNav";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Investigación Científica · Data", description: "Instituciones de investigación y servicios científicos en Chascomús." };

async function get() { try { return await prisma.institucionCientifica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{servicios:true}}} }); } catch { return []; } }

export default async function Page() {
  const instituciones = await get();
  return (
    <section className="mx-auto max-w-editorial px-5 py-16 lg:px-8">
      <header className="max-w-2xl">
        <p className="eyebrow text-acento">Data</p>
        <h1 className="mt-2 font-display text-4xl">Investigación científica</h1>
        <p className="mt-4 text-principal/70">Instituciones de investigación y los servicios científicos que ofrecen en Chascomús.</p>
      </header>
      <div className="mt-10"><ObservatorioNav active="/observatorio/investigacion" /></div>
      {instituciones.length === 0 ? (
        <p className="mt-12 text-principal/50">Todavía no hay instituciones cargadas.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instituciones.map((inst) => (
            <Link key={inst.id} href={`/observatorio/investigacion/${inst.slug}`} className="block rounded-2xl border border-principal/10 p-6 transition-colors hover:border-acento">
              <div className="flex items-center gap-4">
                {inst.logoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-principal/5 font-display text-xl text-principal/30">{inst.nombre.charAt(0)}</div>
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
  );
}
