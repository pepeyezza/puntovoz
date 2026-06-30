import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createEvento, deleteEvento } from "@/lib/actions/observatorio";

async function getAgenda() {
  try {
    return await prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminAgendaPage() {
  const agenda = await getAgenda();

  return (
    <div>
      <h1 className="font-display text-3xl">Agenda cultural</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {agenda.length === 0 ? (
            <p className="text-principal/50">Todavía no hay eventos cargados.</p>
          ) : (
            agenda.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between rounded-xl border border-principal/10 px-5 py-3">
                <div>
                  <p className="font-medium">{ev.titulo}</p>
                  <p className="text-xs text-principal/50">
                    {ev.fecha.toLocaleDateString("es-AR")} · {ev.lugar}
                  </p>
                </div>
                <form action={deleteEvento.bind(null, ev.id)} className="flex items-center gap-4">
                  <Link href={`/admin/observatorio/agenda/${ev.id}/editar`} className="text-sm font-medium text-acento hover:underline">
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
          <h2 className="font-display text-xl">Nuevo evento</h2>
          <form action={createEvento} className="mt-4 space-y-4">
            <input name="titulo" type="text" required placeholder="Título del evento" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="descripcion" rows={2} placeholder="Descripción" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="fecha" type="date" required className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="lugar" type="text" placeholder="Lugar" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="categoria" type="text" placeholder="Categoría" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="enlace" type="url" placeholder="Link del evento (opcional)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
