export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateIndicador } from "@/lib/actions/observatorio";
import { CATEGORIAS_INDICADORES } from "@/lib/categoriasIndicadores";

export default async function Page({ params }: { params: { id: string } }) {
  const ind = await prisma.indicador.findUnique({ where: { id: params.id } });
  if (!ind) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar indicador</h1>
      <p className="mt-1 text-principal/60">{ind.nombre}</p>
      <form action={updateIndicador.bind(null, ind.id)} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input name="nombre" type="text" required defaultValue={ind.nombre} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Valor</label>
            <input name="valor" type="number" step="any" required defaultValue={ind.valor} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
          </div>
          <div>
            <label className="text-sm font-medium">Unidad</label>
            <input name="unidad" type="text" required defaultValue={ind.unidad} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Período</label>
          <input name="periodo" type="text" required defaultValue={ind.periodo} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div>
          <label className="text-sm font-medium">Categoría</label>
          <select name="categoria" defaultValue={ind.categoria ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento">
            <option value="">— Sin categoría —</option>
            {CATEGORIAS_INDICADORES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Fuente</label>
          <input name="fuente" type="text" defaultValue={ind.fuente ?? ""} className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">Guardar</button>
          <a href="/admin/observatorio/indicadores" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">Cancelar</a>
        </div>
      </form>
    </div>
  );
}
