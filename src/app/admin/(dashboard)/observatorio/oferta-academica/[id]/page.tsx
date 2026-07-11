export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteCarrera } from "@/lib/actions/ofertaAcademica";

export default async function Page({ params }: { params: { id: string } }) {
  const inst = await prisma.institucionAcademica.findUnique({ where: { id: params.id }, include: { carreras: { orderBy: { nombre: "asc" } } } });
  if (!inst) notFound();

  return (
    <div>
      <Link href="/admin/observatorio/oferta-academica" className="text-sm font-medium text-principal/60 hover:text-acento">← Oferta académica</Link>
      <div className="mt-6 flex items-center gap-5">
        {inst.logoUrl && <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-principal/10"><Image src={inst.logoUrl} alt={inst.nombre} fill className="object-contain p-1" /></div>}
        <div>
          <h1 className="font-display text-3xl">{inst.nombre}</h1>
          <Link href={`/admin/observatorio/oferta-academica/${inst.id}/editar`} className="mt-1 inline-block text-sm font-medium text-acento hover:underline">Editar institución</Link>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-2xl">Carreras y programas</h2>
        <Link href={`/admin/observatorio/oferta-academica/${inst.id}/carreras/nueva`} className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">+ Nueva carrera</Link>
      </div>
      <div className="mt-6 space-y-4">
        {inst.carreras.length === 0 ? <p className="text-principal/50">Todavía no hay carreras cargadas.</p> : inst.carreras.map((c) => (
          <div key={c.id} className="rounded-2xl border border-principal/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium">{c.nombre}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-principal/50">
                  {c.modalidad && <span>{c.modalidad}</span>}
                  {c.duracion && <span>· {c.duracion}</span>}
                  {c.area && <span>· {c.area}</span>}
                </div>
                {c.titulo && <p className="mt-1 text-xs text-acento">Título: {c.titulo}</p>}
                {c.planEstudioUrl && <a href={c.planEstudioUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-principal/60 hover:text-acento">Ver plan de estudios →</a>}
              </div>
              <div className="flex shrink-0 gap-3">
                <Link href={`/admin/observatorio/oferta-academica/${inst.id}/carreras/${c.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                <form action={deleteCarrera.bind(null, c.id)}><button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
