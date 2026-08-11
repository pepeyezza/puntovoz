export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateInstitucion } from "@/lib/actions/ofertaAcademica";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default async function Page({ params }: { params: { id: string } }) {
  const inst = await prisma.institucionAcademica.findUnique({ where: { id: params.id } });
  if (!inst) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar institucion</h1>
      <p className="mt-1 text-principal/60">{inst.nombre}</p>
      <form action={updateInstitucion.bind(null, inst.id)} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required defaultValue={inst.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select name="tipo" defaultValue={inst.tipo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="universidad">Universidad</option>
            <option value="instituto">Instituto</option>
            <option value="formacion_laboral">Centro de formacion laboral</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Descripcion</label>
          <div className="mt-2">
            <RichTextEditor name="descripcion" defaultValue={inst.descripcion ?? ""} placeholder="Descripcion de la institucion..." />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Direccion</label>
          <input name="direccion" type="text" defaultValue={inst.direccion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Telefono</label>
            <input name="telefono" type="text" defaultValue={inst.telefono ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input name="email" type="email" defaultValue={inst.email ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Sitio web</label>
          <p className="mt-0.5 text-xs text-principal/40">La URL completa se mostrara visible en la ficha publica.</p>
          <input name="web" type="url" defaultValue={inst.web ?? ""} placeholder="https://..." className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <ImageUploadField name="logoUrl" defaultValue={inst.logoUrl ?? ""} label="Logo de la institucion" />
        <ImageUploadField name="imagen" defaultValue={(inst as any).imagen ?? ""} label="Imagen principal de la institucion" />
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          <a href="/admin/observatorio/oferta-academica" className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
