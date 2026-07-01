export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateNota } from "@/lib/actions/observatorio";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default async function EditarNotaPage({ params }: { params: { id: string } }) {
  const nota = await prisma.notaObservatorio.findUnique({ where: { id: params.id } });
  if (!nota) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar nota</h1>
      <p className="mt-1 text-principal/60">{nota.titulo}</p>

      <form action={updateNota.bind(null, nota.id)} className="mt-8 max-w-2xl space-y-5">
        <div>
          <label className="text-sm font-medium">Título</label>
          <input
            name="titulo"
            type="text"
            required
            defaultValue={nota.titulo}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Contenido</label>
          <div className="mt-2">
            <RichTextEditor name="contenido" defaultValue={nota.contenido} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={nota.status}
            className="mt-2 rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/observatorio/notas" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
