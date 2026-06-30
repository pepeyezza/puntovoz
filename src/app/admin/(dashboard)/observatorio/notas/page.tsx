import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createNota, deleteNota } from "@/lib/actions/observatorio";
import RichTextEditor from "@/components/admin/RichTextEditor";

async function getNotas() {
  try {
    return await prisma.notaObservatorio.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminNotasPage() {
  const notas = await getNotas();

  return (
    <div>
      <h1 className="font-display text-3xl">Notas del Observatorio</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {notas.length === 0 ? (
            <p className="text-principal/50">Todavía no hay notas cargadas.</p>
          ) : (
            notas.map((n) => (
              <div key={n.id} className="flex items-center justify-between rounded-xl border border-principal/10 px-5 py-3">
                <div>
                  <p className="font-medium">{n.titulo}</p>
                  <p className="text-xs text-principal/50">
                    {n.status === "PUBLISHED" ? "Publicada" : "Borrador"}
                  </p>
                </div>
                <form action={deleteNota.bind(null, n.id)} className="flex items-center gap-4">
                  <Link href={`/admin/observatorio/notas/${n.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                    Editar
                  </Link>
                  <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nueva nota</h2>
          <form action={createNota} className="mt-4 space-y-4">
            <input
              name="titulo"
              type="text"
              required
              placeholder="Título de la nota"
              className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento"
            />
            <RichTextEditor name="contenido" placeholder="Contenido completo de la nota…" />
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
