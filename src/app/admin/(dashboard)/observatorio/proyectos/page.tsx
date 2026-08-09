export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createProyecto, deleteProyecto } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ReorderableList from "@/components/admin/ReorderableList";

function tipoLabel(tipo: string) {
  const map: Record<string, string> = { publico: "Público", privado: "Privado", mixto: "Mixto", comunitario: "Comunitario", internacional: "Internacional" };
  return map[tipo] ?? tipo;
}

async function getProyectos() {
  try { return await prisma.proyectoLocal.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] }); }
  catch { return []; }
}

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos();
  const items = proyectos.map((p) => ({
    id: p.id, title: p.nombre,
    subtitle: p.area ?? "", badge: tipoLabel(p.tipo),
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">Iniciativas</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ReorderableList items={items} tipo="proyecto" />
          <div className="mt-4 space-y-1">
            {proyectos.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-2">
                {(p as any).logoUrl && (
                  <div className="relative h-6 w-6 overflow-hidden rounded border border-principal/10">
                    <Image src={(p as any).logoUrl} alt={p.nombre} fill className="object-contain" />
                  </div>
                )}
                <span className="flex-1 text-sm truncate text-principal/60">{p.nombre}</span>
                <Link href={`/admin/observatorio/proyectos/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                <form action={deleteProyecto.bind(null, p.id)}>
                  <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nueva iniciativa</h2>
          <form action={createProyecto} className="mt-4 space-y-4">
            <input name="nombre" type="text" required placeholder="Nombre de la iniciativa" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="descripcion" rows={3} placeholder="Descripción" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="area" type="text" placeholder="Área" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <select name="tipo" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento">
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
              <option value="mixto">Mixto</option>
              <option value="comunitario">Comunitario</option>
              <option value="internacional">Internacional</option>
            </select>
            <input name="enlace" type="url" placeholder="Link (opcional)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <ImageUploadField name="logoUrl" label="Logo / identidad de la organización" />
            <ImageUploadField name="imagen" label="Imagen principal del proyecto" />
            <button type="submit" className="w-full rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
