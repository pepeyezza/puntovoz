export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteIndicador } from "@/lib/actions/observatorio";
import { CATEGORIAS_INDICADORES } from "@/lib/categoriasIndicadores";

async function getIndicadores() {
  try { return await prisma.indicador.findMany({ orderBy: [{ categoria: "asc" }, { nombre: "asc" }] }); }
  catch { return []; }
}

export default async function AdminIndicadoresPage() {
  const indicadores = await getIndicadores();

  // Agrupar por categoría
  const porCategoria: Record<string, typeof indicadores> = {};
  indicadores.forEach((ind) => {
    const cat = ind.categoria ?? "Sin categoría";
    if (!porCategoria[cat]) porCategoria[cat] = [];
    porCategoria[cat].push(ind);
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Indicadores</h1>
          <p className="mt-1 text-principal/60">{indicadores.length} indicadores cargados.</p>
        </div>
        <Link href="/admin/observatorio/indicadores/nuevo" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo indicador
        </Link>
      </div>

      {indicadores.length === 0 ? (
        <p className="mt-8 text-principal/50">Todavía no hay indicadores cargados.</p>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(porCategoria).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="font-display text-lg text-acento">{cat}</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-principal/10">
                <table className="w-full text-sm">
                  <thead className="bg-principal/[0.03] text-left text-principal/50">
                    <tr>
                      <th className="px-5 py-3 font-medium">Nombre</th>
                      <th className="px-5 py-3 font-medium">Valor</th>
                      <th className="px-5 py-3 font-medium">Período</th>
                      <th className="px-5 py-3 font-medium">Fuente</th>
                      <th className="px-5 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((ind) => (
                      <tr key={ind.id} className="border-t border-principal/10">
                        <td className="px-5 py-3 font-medium">{ind.nombre}</td>
                        <td className="px-5 py-3">{ind.valor} {ind.unidad}</td>
                        <td className="px-5 py-3 text-principal/60">{ind.periodo}</td>
                        <td className="px-5 py-3 text-principal/50">{ind.fuente ?? "—"}</td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/admin/observatorio/indicadores/${ind.id}/editar`} className="text-sm font-medium text-acento hover:underline">Editar</Link>
                          <form action={deleteIndicador.bind(null, ind.id)} className="ml-4 inline">
                            <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">Eliminar</button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
