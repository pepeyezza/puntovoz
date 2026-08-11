export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProyecto } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default async function Page({ params }: { params: { id: string } }) {
  const proyecto = await prisma.proyectoLocal.findUnique({ where: { id: params.id } });
  if (!proyecto) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar iniciativa</h1>
      <p className="mt-1 text-principal/60">{proyecto.nombre}</p>
      <form action={updateProyecto.bind(null, proyecto.id)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required defaultValue={proyecto.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripcion</label>
          <div className="mt-2">
            <RichTextEditor name="descripcion" defaultValue={proyecto.descripcion ?? ""} placeholder="Descripcion de la iniciativa..." />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Area</label>
          <input name="area" type="text" defaultValue={proyecto.area ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select name="tipo" defaultValue={proyecto.tipo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="publico">Publico</option>
            <option value="privado">Privado</option>
            <option value="mixto">Mixto</option>
            <option value="comunitario">Comunitario</option>
            <option value="internacional">Internacional</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Link de la iniciativa</label>
          <p className="mt-0.5 text-xs text-principal/40">La URL completa se mostrara visible en la ficha publica.</p>
          <input name="enlace" type="url" defaultValue={proyecto.enlace ?? ""} placeholder="https://..." className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <ImageUploadField name="logoUrl" defaultValue={(proyecto as any).logoUrl ?? ""} label="Logo / identidad de la organizacion (miniatura)" />
        <ImageUploadField name="imagen" defaultValue={(proyecto as any).imagen ?? ""} label="Imagen principal del proyecto" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href="/admin/observatorio/proyectos" className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
