export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createEvento, deleteEvento } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";

async function getAgenda() {
  try { return await prisma.eventoAgenda.findMany({ orderBy: { fecha: "asc" } }); }
  catch { return []; }
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
              <div key={ev.id} className="flex items-center gap-4 rounded-xl border border-principal/10 px-5 py-4">
                {(ev as any).imagen ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-principal/10">
                    <Image src={(ev as any).imagen} alt={ev.titulo} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-principal/5 text-xs text-principal/30">Sin img</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ev.titulo}</p>
                  <p className="text-xs text-principal/50">{ev.fecha.toLocaleDateString("es-AR")} · {ev.lugar}</p>
                </div>
                <div className="flex shrink-0 gap-3">
                  <Link href={`/admin/observatorio/agenda/${ev.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                  <form action={deleteEvento.bind(null, ev.id)}>
                    <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nuevo evento</h2>
          <form action={createEvento} className="mt-4 space-y-3">
            <input name="titulo" type="text" required placeholder="Título" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="descripcion" rows={2} placeholder="Descripción" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="fecha" type="date" required className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="lugar" type="text" placeholder="Lugar" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="categoria" type="text" placeholder="Categoría" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="enlace" type="url" placeholder="Link del evento (opcional)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <ImageUploadField name="imagen" label="Imagen del evento (opcional)" />
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
