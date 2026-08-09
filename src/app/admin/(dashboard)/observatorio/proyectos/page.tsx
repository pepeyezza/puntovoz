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
  Comunitario: "bg-[#d8f3dc] text-[#2d6a4f]",
  Internacional: "bg-[#ede9fe] text-[#6d28d9]",
};

function tipoLabel(tipo: string) {
  const map: Record<string, string> = { publico: "Público", privado: "Privado", mixto: "Mixto", comunitario: "Comunitario", internacional: "Internacional" };
  return map[tipo] ?? tipo;
}

async function getProyectos() {
  try { return await prisma.proyectoLocal.findMany({ orderBy: { createdAt: "desc" } }); }
  catch { return []; }
}

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos();

  return (
    <div>
      <h1 className="font-display text-3xl">Iniciativas</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {proyectos.length === 0 ? (
            <p className="text-principal/50">Todavía no hay iniciativas cargadas.</p>
          ) : (
            proyectos.map((p) => (
              <div key={p.id} className="rounded-xl border border-principal/10 p-5">
                <div className="flex items-start gap-4">
                  {/* Logo pequeño */}
                  {(p as any).logoUrl ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-principal/10">
                      <Image src={(p as any).logoUrl} alt={p.nombre} fill className="object-contain p-1" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-acento/10 text-xs font-bold text-acento">
                      {p.nombre.charAt(0)}
                    </div>
                  )}
                  {/* Imagen principal */}
                  {(p as any).imagen && (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-principal/10">
                      <Image src={(p as any).imagen} alt={p.nombre} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{p.nombre}</p>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${TIPO_COLOR[tipoLabel(p.tipo)] ?? "bg-principal/10 text-principal/60"}`}>
                        {tipoLabel(p.tipo)}
                      </span>
                    </div>
                    <p className="text-xs text-principal/50">{p.area}</p>
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
          <h2 className="font-display text-xl">Nueva iniciativa</h2>
          <form action={createProyecto} className="mt-4 space-y-4">
            <input name="nombre" type="text" required placeholder="Nombre de la iniciativa" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <textarea name="descripcion" rows={3} placeholder="Descripción" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <input name="area" type="text" placeholder="Área (Infraestructura, Producción…)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <select name="tipo" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento">
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
              <option value="mixto">Mixto</option>
              <option value="comunitario">Comunitario</option>
              <option value="internacional">Internacional</option>
            </select>
            <input name="enlace" type="url" placeholder="Link del proyecto (opcional)" className="w-full rounded-xl border border-principal/15 bg-secundario px-4 py-2.5 text-sm outline-none focus-visible:border-acento" />
            <ImageUploadField name="logoUrl" label="Logo / identidad de la organización (miniatura)" />
            <ImageUploadField name="imagen" label="Imagen principal del proyecto" />
            <button type="submit" className="w-full rounded-lg bg-principal px-6 py-3 text-sm font-semibold text-secundario">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
