export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHerramienta } from "@/lib/actions/herramientas";
import { CATEGORIAS_HERRAMIENTAS } from "@/lib/herramientas";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default async function Page({ params }: { params: { id: string } }) {
  const h = await (prisma as any).herramientaTecnologica.findUnique({ where: { id: params.id } });
  if (!h) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar herramienta</h1>
      <p className="mt-1 text-principal/60">{h.nombre}</p>
      <form action={updateHerramienta.bind(null, h.id)} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required defaultValue={h.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea name="descripcion" rows={3} defaultValue={h.descripcion ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select name="categoria" defaultValue={h.categoria} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            {CATEGORIAS_HERRAMIENTAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Link a la herramienta</label>
          <input name="enlace" type="url" required defaultValue={h.enlace} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <ImageUploadField name="logoUrl" defaultValue={h.logoUrl ?? ""} label="Logo o miniatura" />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="destacada" id="destacada" defaultChecked={h.destacada} className="h-4 w-4 rounded accent-acento" />
          <label htmlFor="destacada" className="text-sm font-medium cursor-pointer">Destacar en el resumen de Data</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">Guardar</button>
          <a href="/admin/observatorio/herramientas" className="rounded-lg border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
