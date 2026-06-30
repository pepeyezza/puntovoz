import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateIndicador } from "@/lib/actions/indicadores";

export default async function EditarIndicadorPage({ params }: { params: { id: string } }) {
  const indicador = await prisma.indicador.findUnique({ where: { id: params.id } });
  if (!indicador) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Editar indicador</h1>
      <p className="mt-1 text-principal/60">{indicador.nombre}</p>

      <form action={updateIndicador.bind(null, indicador.id)} className="mt-8 max-w-lg space-y-5">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            type="text"
            required
            defaultValue={indicador.nombre}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Valor</label>
            <input
              name="valor"
              type="number"
              step="0.1"
              required
              defaultValue={indicador.valor}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Unidad</label>
            <input
              name="unidad"
              type="text"
              required
              defaultValue={indicador.unidad}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Período</label>
            <input
              name="periodo"
              type="text"
              required
              defaultValue={indicador.periodo}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <input
              name="categoria"
              type="text"
              defaultValue={indicador.categoria ?? ""}
              className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Fuente (opcional)</label>
          <input
            name="fuente"
            type="text"
            defaultValue={indicador.fuente ?? ""}
            className="mt-2 w-full rounded-xl border border-principal/15 bg-secundario px-4 py-3 text-sm outline-none focus-visible:border-acento"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-full bg-principal px-6 py-3 text-sm font-semibold text-secundario hover:-translate-y-0.5">
            Guardar
          </button>
          <a href="/admin/observatorio/indicadores" className="rounded-full border border-principal/15 px-6 py-3 text-sm font-medium hover:border-acento hover:text-acento">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
