export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteInstitucion } from "@/lib/actions/ofertaAcademica";

const TIPO_LABEL: Record<string,string> = { universidad:"Universidad", instituto:"Instituto", formacion_laboral:"Centro de formación", otro:"Otro" };

async function get() { try { return await prisma.institucionAcademica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{carreras:true}}} }); } catch { return []; } }

export default async function Page() {
  const instituciones = await get();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl">Oferta académica</h1><p className="mt-1 text-principal/60">Instituciones educativas y sus carreras.</p></div>
        <Link href="/admin/observatorio/oferta-academica/nueva" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nueva institución</Link>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {instituciones.length === 0 ? <p className="text-principal/50">Todavía no hay instituciones cargadas.</p> : instituciones.map((inst) => (
          <div key={inst.id} className="rounded-2xl border border-principal/10 p-5">
            <div className="flex items-start gap-4">
              {inst.logoUrl ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-principal/5 text-xl text-principal/30">{inst.nombre.charAt(0)}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-snug">{inst.nombre}</p>
                <p className="text-xs text-acento">{TIPO_LABEL[inst.tipo] ?? inst.tipo}</p>
                <p className="mt-1 text-xs text-principal/50">{inst._count.carreras} carrera(s)</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/admin/observatorio/oferta-academica/${inst.id}`} className="text-sm font-medium text-acento hover:underline">Ver carreras</Link>
              <Link href={`/admin/observatorio/oferta-academica/${inst.id}/editar`} className="text-sm font-medium text-principal/60 hover:text-acento">Editar</Link>
              <form action={deleteInstitucion.bind(null, inst.id)} className="ml-auto"><button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
