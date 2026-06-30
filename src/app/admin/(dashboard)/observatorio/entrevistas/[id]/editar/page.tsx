import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateEntrevista } from "@/lib/actions/observatorio";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default async function EditarEntrevistaPage({ params }: { params: { id: string } }) {
  const entrevista = await prisma.entrevista.findUnique({ where: { id: params.id } });
  if (!entrevista) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar entrevista</h1>
      <p className="mt-1 text-principal/60">{entrevista.entrevistado}</p>

      <form action={updateEntrevista.bind(null, entrevista.id)} className="mt-8 max-w-2xl space-y-5">
        <div>
          <label className="text-sm font-medium">Entrevistado/a</label>
          <input
            name="entrevistado"
            type="text"
            required
            defaultValue={entrevista.entrevistado}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Cargo o rol</label>
          <input
            name="cargo"
            type="text"
            defaultValue={entrevista.cargo ?? ""}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Resumen</label>
          <textarea
            name="resumen"
            rows={2}
            defaultValue={entrevista.resumen}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Contenido</label>
          <div className="mt-2">
            <RichTextEditor name="contenido" defaultValue={entrevista.contenido} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="status"
            defaultValue={entrevista.status}
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
          <a href="/admin/observatorio/entrevistas" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
