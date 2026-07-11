export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteInstitucionCientifica } from "@/lib/actions/investigacion";

async function get() { try { return await prisma.institucionCientifica.findMany({ orderBy:{nombre:"asc"}, include:{_count:{select:{servicios:true}}} }); } catch { return []; } }

export default async function Page() {
  const instituciones = await get();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl">Investigación científica</h1><p className="mt-1 text-principal/60">Instituciones de investigación y sus servicios.</p></div>
        <Link href="/admin/observatorio/investigacion/nueva" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nueva institución</Link>
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
                <p className="mt-1 text-xs text-principal/50">{inst._count.servicios} servicio(s)</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/admin/observatorio/investigacion/${inst.id}`} className="text-sm font-medium text-acento hover:underline">Ver servicios</Link>
              <Link href={`/admin/observatorio/investigacion/${inst.id}/editar`} className="text-sm font-medium text-principal/60 hover:text-acento">Editar</Link>
              <form action={deleteInstitucionCientifica.bind(null, inst.id)} className="ml-auto"><button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
