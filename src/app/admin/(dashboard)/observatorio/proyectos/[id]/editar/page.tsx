export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProyecto } from "@/lib/actions/observatorio";

export default async function EditarProyectoPage({ params }: { params: { id: string } }) {
  const proyecto = await prisma.proyectoLocal.findUnique({ where: { id: params.id } });
  if (!proyecto) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar proyecto</h1>
      <p className="mt-1 text-principal/60">{proyecto.nombre}</p>

      <form action={updateProyecto.bind(null, proyecto.id)} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required defaultValue={proyecto.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>

        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea name="descripcion" rows={4} defaultValue={proyecto.descripcion} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>

        <div>
          <label className="text-sm font-medium">Área</label>
          <input name="area" type="text" defaultValue={proyecto.area ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>

        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select name="tipo" defaultValue={proyecto.tipo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Link del proyecto (opcional)</label>
          <input name="enlace" type="url" defaultValue={proyecto.enlace ?? ""} placeholder="https://…" className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/observatorio/proyectos" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
