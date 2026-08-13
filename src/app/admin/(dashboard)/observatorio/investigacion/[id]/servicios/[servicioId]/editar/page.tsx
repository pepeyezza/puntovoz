export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateServicio } from "@/lib/actions/investigacion";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default async function Page({ params }: { params: { id: string; servicioId: string } }) {
  const servicio = await prisma.servicioCientifico.findUnique({
    where: { id: params.servicioId },
    include: { institucion: true },
  });
  if (!servicio || servicio.institucionId !== params.id) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar servicio</h1>
      <p className="mt-1 text-principal/60">{servicio.nombre} · {servicio.institucion.nombre}</p>
      <form action={updateServicio.bind(null, servicio.id)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre del servicio</label>
          <input name="nombre" type="text" required defaultValue={servicio.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Area o disciplina</label>
          <input name="area" type="text" defaultValue={servicio.area ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripcion</label>
          <div className="mt-2">
            <RichTextEditor name="descripcion" defaultValue={servicio.descripcion ?? ""} placeholder="Descripcion del servicio..." />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Contacto para este servicio</label>
          <input name="contacto" type="text" defaultValue={servicio.contacto ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <ImageUploadField name="imagen" defaultValue={(servicio as any).imagen ?? ""} label="Imagen del servicio (opcional)" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href={`/admin/observatorio/investigacion/${params.id}`} className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
