export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProyecto, deleteProyecto } from "@/lib/actions/observatorio";

async function getProyectos() {
  try {
    return await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

const TIPO_LABEL: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  mixto: "Mixto",
};

const TIPO_COLOR: Record<string, string> = {
  publico: "bg-joven/20 text-principal",
  privado: "bg-acento/15 text-acento",
  mixto: "bg-principal/10 text-principal/60",
};

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <div>
      <h1 className="font-display text-3xl">Proyectos de desarrollo local</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {proyectos.length === 0 ? (
            <p className="text-principal/50">Todavía no hay proyectos cargados.</p>
          ) : (
            proyectos.map((p) => (
              <div key={p.id} className="rounded-xl border border-principal/10 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <p className="font-medium">{p.nombre}</p>
                    <p className="text-xs text-principal/50">{p.area}</p>
                    {p.descripcion && <p className="mt-1 text-sm text-principal/60 line-clamp-2">{p.descripcion}</p>}
                    {p.enlace && <a href={p.enlace} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-acento hover:underline">{p.enlace}</a>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TIPO_COLOR[p.tipo] ?? "bg-principal/10 text-principal/60"}`}>
                      {TIPO_LABEL[p.tipo] ?? p.tipo}
                    </span>
                    <div className="flex gap-3">
                      <Link href={`/admin/observatorio/proyectos/${p.id}/editar`} className="text-xs font-medium text-acento hover:underline">
                        Editar
                      </Link>
                      <form action={deleteProyecto.bind(null, p.id)}>
                        <button type="submit" className="text-xs font-medium text-principal/50 hover:text-acento">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-principal/10 p-6">
          <h2 className="font-display text-xl">Nuevo proyecto</h2>
          <form action={createProyecto} className="mt-4 space-y-4">
            <input name="nombre" type="text" required placeholder="Nombre del proyecto" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="descripcion" rows={3} placeholder="Descripción" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="area" type="text" placeholder="Área (Infraestructura, Producción…)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <select name="tipo" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento">
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
              <option value="mixto">Mixto</option>
            </select>
            <input name="enlace" type="url" placeholder="Link del proyecto (opcional)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
