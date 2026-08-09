export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createEvento, deleteEvento } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ReorderableList from "@/components/admin/ReorderableList";

async function getAgenda() {
  try {
    return await prisma.eventoAgenda.findMany({
      orderBy: [{ orden: "asc" }, { createdAt: "desc" }],
    });
  } catch { return []; }
}

export default async function AdminAgendaPage() {
  const agenda = await getAgenda();
  const items = agenda.map((ev) => ({
    id: ev.id,
    title: ev.titulo,
    subtitle: ev.fecha.toLocaleDateString("es-AR"),
    badge: ev.lugar ?? "",
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">Agenda cultural</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Lista reordenable */}
        <div>
          <ReorderableList items={items} tipo="agenda" />
          <div className="mt-4 space-y-2">
            {agenda.map((ev) => (
              <div key={ev.id} className="flex items-center justify-end gap-3 px-4">
                <Link href={`/admin/observatorio/agenda/${ev.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                <form action={deleteEvento.bind(null, ev.id)}>
                  <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario nuevo evento */}
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
            <button type="submit" className="w-full rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
