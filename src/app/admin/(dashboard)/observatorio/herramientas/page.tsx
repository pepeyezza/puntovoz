export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteHerramienta } from "@/lib/actions/herramientas";
import { CATEGORIAS_HERRAMIENTAS, HERRAMIENTAS_DEMO } from "@/lib/herramientas";

async function getHerramientas() {
  try {
    const h = await (prisma as any).herramientaTecnologica.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] });
    return h.length ? h : [];
  } catch { return []; }
}

export default async function AdminHerramientasPage() {
  const herramientas = await getHerramientas();
  const porCategoria: Record<string, typeof herramientas> = {};
  herramientas.forEach((h: any) => {
    if (!porCategoria[h.categoria]) porCategoria[h.categoria] = [];
    porCategoria[h.categoria].push(h);
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Tablero de herramientas</h1>
          <p className="mt-1 text-principal/60">{herramientas.length} herramienta(s) cargadas.</p>
        </div>
        <Link href="/admin/observatorio/herramientas/nueva" className="rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nueva herramienta
        </Link>
      </div>

      {herramientas.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-joven/30 bg-joven/5 p-6">
          <p className="font-medium">Todavía no hay herramientas cargadas.</p>
          <p className="mt-1 text-sm text-principal/60">El sitio muestra {HERRAMIENTAS_DEMO.length} herramientas de ejemplo hasta que cargues las tuyas.</p>
          <Link href="/admin/observatorio/herramientas/nueva" className="mt-4 inline-block rounded-lg bg-principal px-5 py-2.5 text-sm font-semibold text-secundario">
            Cargar primera herramienta
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(porCategoria).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-display text-lg text-acento">{cat}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((h: any) => (
                  <div key={h.id} className="rounded-xl border border-principal/10 p-4">
                    <div className="flex items-center gap-3">
                      {h.logoUrl ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-principal/10">
                          <Image src={h.logoUrl} alt={h.nombre} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-principal/10 font-display text-sm font-bold text-principal/40">
                          {h.nombre.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{h.nombre}</p>
                        {h.destacada && <span className="text-xs text-joven">★ Destacada</span>}
                      </div>
                    </div>
                    {h.descripcion && <p className="mt-2 text-xs text-principal/50 line-clamp-2">{h.descripcion}</p>}
                    <div className="mt-3 flex gap-3">
                      <Link href={`/admin/observatorio/herramientas/${h.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                      <a href={h.enlace} target="_blank" rel="noreferrer" className="text-sm font-medium text-principal/40 hover:text-principal">Ver sitio</a>
                      <form action={deleteHerramienta.bind(null, h.id)} className="ml-auto">
                        <button type="submit" className="text-sm text-principal/30 hover:text-acento">Eliminar</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
