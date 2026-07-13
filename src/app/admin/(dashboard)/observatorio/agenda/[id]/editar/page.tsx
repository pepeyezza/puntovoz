export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEvento } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function Page({ params }: { params: { id: string } }) {
  const evento = await prisma.eventoAgenda.findUnique({ where: { id: params.id } });
  if (!evento) notFound();

  const fechaStr = evento.fecha.toISOString().split("T")[0];

  return (
    <div>
      <h1 className="font-display text-3xl">Editar evento</h1>
      <p className="mt-1 text-principal/60">{evento.titulo}</p>
      <form action={updateEvento.bind(null, evento.id)} className="mt-8 max-w-lg space-y-5">
        <div><label className="text-sm font-medium">Título</label><input name="titulo" type="text" required defaultValue={evento.titulo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Descripción</label><textarea name="descripcion" rows={3} defaultValue={evento.descripcion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Fecha</label><input name="fecha" type="date" required defaultValue={fechaStr} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Lugar</label><input name="lugar" type="text" defaultValue={evento.lugar ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Categoría</label><input name="categoria" type="text" defaultValue={evento.categoria ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Link (opcional)</label><input name="enlace" type="url" defaultValue={(evento as any).enlace ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <ImageUploadField name="imagen" defaultValue={(evento as any).imagen ?? ""} label="Imagen del evento (opcional)" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href="/admin/observatorio/agenda" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
