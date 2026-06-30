import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteIndicador } from "@/lib/actions/indicadores";

async function getIndicadores() {
  try {
    return await prisma.indicador.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminIndicadoresPage() {
  const indicadores = await getIndicadores();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Indicadores</h1>
          <p className="mt-1 text-principal/60">Datos socioeconómicos y productivos del partido.</p>
        </div>
        <Link href="/admin/observatorio/indicadores/nuevo" className="rounded-full bg-principal px-5 py-2.5 text-sm font-semibold text-secundario hover:-translate-y-0.5">
          + Nuevo indicador
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-principal/10">
        <table className="w-full text-sm">
          <thead className="bg-principal/[0.03] text-left text-principal/50">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Período</th>
              <th className="px-5 py-3 font-medium">Categoría</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {indicadores.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-principal/50">
                  Todavía no hay indicadores cargados.
                </td>
              </tr>
            ) : (
              indicadores.map((i) => (
                <tr key={i.id} className="border-t border-principal/10">
                  <td className="px-5 py-3 font-medium">{i.nombre}</td>
                  <td className="px-5 py-3 text-acento">
                    {i.valor} {i.unidad}
                  </td>
                  <td className="px-5 py-3 text-principal/60">{i.periodo}</td>
                  <td className="px-5 py-3 text-principal/60">{i.categoria ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/observatorio/indicadores/${i.id}/editar`} className="text-sm font-medium text-acento hover:underline">
                      Editar
                    </Link>
                    <form action={deleteIndicador.bind(null, i.id)} className="ml-4 inline">
                      <button type="submit" className="text-sm font-medium text-principal/50 hover:text-acento">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
