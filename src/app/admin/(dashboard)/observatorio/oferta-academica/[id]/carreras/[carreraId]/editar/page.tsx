export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCarrera } from "@/lib/actions/ofertaAcademica";
import PdfUploadField from "@/components/admin/PdfUploadField";

export default async function Page({ params }: { params: { id: string; carreraId: string } }) {
  const carrera = await prisma.carreraOferta.findUnique({ where: { id: params.carreraId }, include: { institucion: true } });
  if (!carrera || carrera.institucionId !== params.id) notFound();
  return (
    <div>
      <h1 className="font-display text-3xl">Editar carrera</h1>
      <p className="mt-1 text-principal/60">{carrera.nombre} · {carrera.institucion.nombre}</p>
      <form action={updateCarrera.bind(null, carrera.id)} className="mt-8 max-w-xl space-y-5">
        <div><label className="text-sm font-medium">Nombre</label><input name="nombre" type="text" required defaultValue={carrera.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Duración</label><input name="duracion" type="text" defaultValue={carrera.duracion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
          <div><label className="text-sm font-medium">Modalidad</label><select name="modalidad" defaultValue={carrera.modalidad} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"><option value="presencial">Presencial</option><option value="virtual">Virtual</option><option value="mixta">Mixta</option></select></div>
        </div>
        <div><label className="text-sm font-medium">Título que otorga</label><input name="titulo" type="text" defaultValue={carrera.titulo ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Área</label><select name="area" defaultValue={carrera.area ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"><option value="">— Seleccioná —</option><option>Ciencia y Tecnología</option><option>Salud</option><option>Humanidades</option><option>Educación</option><option>Arte y diseño</option><option>Agro y producción</option><option>Administración</option><option>Otro</option></select></div>
        <div><label className="text-sm font-medium">Período de inscripción</label><input name="inscripcion" type="text" defaultValue={carrera.inscripcion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Descripción</label><textarea name="descripcion" rows={3} defaultValue={carrera.descripcion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <PdfUploadField name="planEstudioUrl" defaultValue={carrera.planEstudioUrl ?? ""} label="Plan de estudios (PDF)" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href={`/admin/observatorio/oferta-academica/${params.id}`} className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
