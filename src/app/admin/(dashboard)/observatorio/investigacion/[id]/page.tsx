export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteServicio } from "@/lib/actions/investigacion";

export default async function Page({ params }: { params: { id: string } }) {
  const inst = await prisma.institucionCientifica.findUnique({ where: { id: params.id }, include: { servicios: { orderBy: { nombre: "asc" } } } });
  if (!inst) notFound();
  return (
    <div>
      <Link href="/admin/observatorio/investigacion" className="text-sm font-medium text-principal/60 hover:text-acento">← Investigación científica</Link>
      <div className="mt-6 flex items-center gap-5">
        {inst.logoUrl && <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>}
        <div>
          <h1 className="font-display text-3xl">{inst.nombre}</h1>
          <Link href={`/admin/observatorio/investigacion/${inst.id}/editar`} className="mt-1 inline-block text-sm font-medium text-acento hover:underline">Editar institución</Link>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-2xl">Servicios de investigación</h2>
        <Link href={`/admin/observatorio/investigacion/${inst.id}/servicios/nuevo`} className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nuevo servicio</Link>
      </div>
      <div className="mt-6 space-y-4">
        {inst.servicios.length === 0 ? <p className="text-principal/50">Todavía no hay servicios cargados.</p> : inst.servicios.map((s) => (
          <div key={s.id} className="rounded-2xl border border-principal/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">{s.nombre}</p>
                {s.area && <p className="text-xs text-acento">{s.area}</p>}
                {s.descripcion && <p className="mt-1 text-sm text-principal/60">{s.descripcion}</p>}
                {s.contacto && <p className="mt-1 text-xs text-principal/50">Contacto: {s.contacto}</p>}
              </div>
              <div className="flex shrink-0 gap-3">
                <Link href={`/admin/observatorio/investigacion/${inst.id}/servicios/${s.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                <form action={deleteServicio.bind(null, s.id)}><button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
