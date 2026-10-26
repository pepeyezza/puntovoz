export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProyecto } from "@/lib/actions/iniciativas";
import ReorderableList from "@/components/admin/ReorderableList";

const TIPO_LABEL: Record<string, string> = {
  publico: "Público",
  privado: "Privado",
  mixto: "Mixto",
  comunitario: "Comunitario",
  internacional: "Internacional",
};

async function getProyectos(): Promise<any[]> {
  try {
    return await prisma.proyectoLocal.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "desc" }] });
  } catch {
    return [];
  }
}

export default async function AdminProyectosPage() {
  const proyectos = await getProyectos();
  const items = proyectos.map((p: any) => ({
    id: p.id as string,
    title: p.nombre as string,
    subtitle: (p.area ?? "") as string,
    badge: TIPO_LABEL[p.tipo] ?? (p.tipo as string),
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Iniciativas</h1>
          <p className="mt-1 text-principal/60">Arrastrá para reordenar y guardá. Cada iniciativa tiene su ficha completa.</p>
        </div>
        <Link
          href="/admin/observatorio/proyectos/nuevo"
          className="rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5"
        >
          + Nueva iniciativa
        </Link>
      </div>

      <div className="mt-8 max-w-3xl">
        <ReorderableList items={items} tipo="proyecto" />
        <div className="mt-4 space-y-1">
          {proyectos.map((p: any) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2">
              {p.logoUrl && (
                <div className="relative h-6 w-6 overflow-hidden rounded border border-principal/10">
                  <Image src={p.logoUrl} alt={p.nombre} fill className="object-contain" />
                </div>
              )}
              <span className="flex-1 truncate text-sm text-principal/60">{p.nombre}</span>
              <Link href={`/admin/observatorio/proyectos/${p.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                Editar
              </Link>
              <form action={deleteProyecto.bind(null, p.id)}>
                <button type="submit" className="text-sm font-medium text-principal/40 hover:text-acento">
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
