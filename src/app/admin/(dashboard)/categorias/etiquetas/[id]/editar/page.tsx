import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTag } from "@/lib/actions/taxonomy";

export default async function EditarEtiquetaPage({ params }: { params: { id: string } }) {
  const tag = await prisma.tag.findUnique({ where: { id: params.id } });
  if (!tag) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar etiqueta</h1>

      <form action={updateTag.bind(null, tag.id)} className="mt-8 max-w-sm space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={tag.name}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/categorias" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
