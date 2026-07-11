export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateInstitucion } from "@/lib/actions/ofertaAcademica";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function Page({ params }: { params: { id: string } }) {
  const inst = await prisma.institucionAcademica.findUnique({ where: { id: params.id } });
  if (!inst) notFound();
  return (
    <div>
      <h1 className="font-display text-3xl">Editar institución</h1>
      <p className="mt-1 text-principal/60">{inst.nombre}</p>
      <form action={updateInstitucion.bind(null, inst.id)} className="mt-8 max-w-xl space-y-5">
        <div><label className="text-sm font-medium">Nombre</label><input name="nombre" type="text" required defaultValue={inst.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Tipo</label><select name="tipo" defaultValue={inst.tipo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"><option value="universidad">Universidad</option><option value="instituto">Instituto</option><option value="formacion_laboral">Centro de formación laboral</option><option value="otro">Otro</option></select></div>
        <div><label className="text-sm font-medium">Descripción</label><textarea name="descripcion" rows={3} defaultValue={inst.descripcion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div><label className="text-sm font-medium">Dirección</label><input name="direccion" type="text" defaultValue={inst.direccion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Teléfono</label><input name="telefono" type="text" defaultValue={inst.telefono ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
          <div><label className="text-sm font-medium">Email</label><input name="email" type="email" defaultValue={inst.email ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        </div>
        <div><label className="text-sm font-medium">Sitio web</label><input name="web" type="url" defaultValue={inst.web ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" /></div>
        <ImageUploadField name="logoUrl" defaultValue={inst.logoUrl ?? ""} label="Logo de la institución" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href="/admin/observatorio/oferta-academica" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
