export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createEntrevista, deleteEntrevista } from "@/lib/actions/observatorio";
import RichTextEditor from "@/components/admin/RichTextEditor";

async function getEntrevistas() {
  try {
    return await prisma.entrevista.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminEntrevistasPage() {
  const entrevistas = await getEntrevistas();

  return (
    <div>
      <h1 className="font-display text-3xl">Entrevistas</h1>
      <p className="mt-1 text-principal/60">Voces de referentes del desarrollo local.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {entrevistas.length === 0 ? (
            <p className="text-principal/50">Todavía no hay entrevistas cargadas.</p>
          ) : (
            entrevistas.map((e) => (
              <div key={e.id} className="rounded-2xl border border-principal/10 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{e.entrevistado}</p>
                    <p className="text-sm text-acento">{e.cargo}</p>
                  </div>
                  <form action={deleteEntrevista.bind(null, e.id)}>
                    <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">
                      Eliminar
                    </button>
                  </form>
                </div>
                <Link href={`/admin/observatorio/entrevistas/${e.id}/editar`} className="mt-1 inline-block text-xs font-medium text-acento hover:underline">
                  Editar
                </Link>
                <p className="mt-2 text-sm text-principal/60">{e.resumen}</p>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nueva entrevista</h2>
          <form action={createEntrevista} className="mt-4 space-y-4">
            <input name="entrevistado" type="text" required placeholder="Nombre del entrevistado" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="cargo" type="text" placeholder="Cargo o rol" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="resumen" rows={2} placeholder="Resumen breve" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <RichTextEditor name="contenido" placeholder="Contenido completo de la entrevista…" />
            <select name="status" defaultValue="DRAFT" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento">
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
