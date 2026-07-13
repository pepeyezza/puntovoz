export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { createProyecto, deleteProyecto } from "@/lib/actions/observatorio";
import ImageUploadField from "@/components/admin/ImageUploadField";

const TIPO_COLOR: Record<string, string> = {
  Público: "bg-joven/20 text-principal",
  Privado: "bg-acento/15 text-acento",
  Mixto: "bg-principal/10 text-principal/60",
};

function tipoLabel(tipo: string) {
  if (tipo === "publico") return "Público";
  if (tipo === "privado") return "Privado";
  return "Mixto";
}

async function getProyectos() {
  try { return await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } }); }
  catch { return []; }
}

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <div>
      <h1 className="font-display text-3xl">Proyectos de desarrollo local</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {proyectos.length === 0 ? (
            <p className="text-principal/50">Todavía no hay proyectos cargados.</p>
          ) : (
            proyectos.map((p) => (
              <div key={p.id} className="rounded-xl border border-principal/10 p-5">
                <div className="flex items-start gap-4">
                  {(p as any).imagen ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-principal/10">
                      <Image src={(p as any).imagen} alt={p.nombre} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-principal/5 text-xs text-principal/30">Sin img</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{p.nombre}</p>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${TIPO_COLOR[tipoLabel(p.tipo)] ?? "bg-principal/10 text-principal/60"}`}>
                        {tipoLabel(p.tipo)}
                      </span>
                    </div>
                    <p className="text-xs text-principal/50">{p.area}</p>
                    {p.descripcion && <p className="mt-1 text-sm text-principal/60 line-clamp-2">{p.descripcion}</p>}
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  <Link href={`/admin/observatorio/proyectos/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                  <form action={deleteProyecto.bind(null, p.id)}>
                    <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">Eliminar</button>
                  </form>
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
            <ImageUploadField name="imagen" label="Imagen / logo del proyecto" />
            <button type="submit" className="w-full rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
